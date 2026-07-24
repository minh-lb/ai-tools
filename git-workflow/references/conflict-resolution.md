# Conflict Resolution

## Sync from the correct base first

Before resolving any conflict, make sure the branch is being merged from the correct base.

For `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*` — sync from `develop`:

```bash
git fetch origin
git merge origin/develop
```

For `hotfix/*` — sync from `main`, not `develop`:

```bash
git fetch origin
git merge origin/main
```

## Confirm what operation is actually in progress

Conflict markers can come from a merge, a rebase, or a cherry-pick — each needs a different continuation command, and this workflow only supports the merge path.

```bash
git status
```

- `"You have unmerged paths"` / `"All conflicts fixed but you are still merging"` → a merge is in progress. Proceed with the steps below.
- `"interactive rebase in progress"`, or a `.git/rebase-merge`/`.git/rebase-apply` directory exists → a rebase is in progress. This workflow does not use rebase and does not use `git rebase --abort` either (see `references/principles.md` — it's on the forbidden list along with the rest of the rebase family). This state did not come from this skill's own flow, so do not try to resolve or continue it yourself: stop, explain to the user that the branch has an in-progress rebase from outside this workflow, and let them decide how to exit it before you touch the branch further.
- `"You are currently cherry-picking"` → resolve the same way as a merge conflict below, then run `git cherry-pick --continue` (or `--abort` to drop the cherry-pick).

## Resolving conflicts

When a merge conflict appears:

1. Run `git status` to list all conflicted files.
2. For each conflicted file, open it and read both sides of the conflict markers carefully:
   - `<<<<<<< HEAD` — your branch (current)
   - `=======` — divider
   - `>>>>>>> origin/develop` — the incoming branch
3. Before deciding anything, find out *why* each side changed this code — the markers only show *what* changed, not the intent behind it:
   ```bash
   git log --oneline -3 HEAD -- <file>          # recent history on our side
   git log --oneline -3 MERGE_HEAD -- <file>    # recent history on the incoming side
   git show <commit>                            # read the full commit for either side's change to this hunk
   ```
   A resolution decided purely from the inline diff text, without reading the commit message or reasoning behind either side's change, is a guess — not a resolution.
4. Resolve each conflict intentionally — default to synthesis, not selection (see "Choosing what the resolved file should contain" below for what that means and when a side wins outright instead). See "Delete/rename conflicts" below if the file shows no markers but `git status` still lists it as unmerged.
5. After editing, grep for leftover markers before trusting the file: `grep -n "<<<<<<<\|=======\|>>>>>>>" <file>`. A stray marker can still be syntactically valid in loosely-typed files (JSON, YAML, Markdown, `.env`, config) and won't be caught by "does it compile." Then verify the file compiles or parses correctly.
6. Diff the resolved file against *both* parents before staging — this is the concrete check against silently dropping one side's work:
   ```bash
   git diff HEAD -- <file>          # what you changed relative to our own side
   git diff MERGE_HEAD -- <file>    # what you changed relative to the incoming side
   ```
   If either of these is empty, the resolution is identical to one side in full — confirm that's actually correct for a genuine content conflict (it sometimes is, e.g. a full rewrite that supersedes the other side), rather than assuming it's fine by default.
7. Stage each resolved file: `git add <file>`
8. Before completing the merge, note every conflicted file in the commit body — keep Git's default summary line (`Merge branch '<x>' into <y>`), append a `Conflicts resolved in:` list naming each file and, briefly, how it was resolved:
   ```bash
   git commit -m "$(cat .git/MERGE_MSG)

   Conflicts resolved in:
   - path/to/fileA.ts: kept incoming refactor, reapplied our validation guard
   - path/to/fileB.json: merged both sides' additions
   - path/to/package-lock.json: regenerated from resolved package.json"
   ```
   `.git/MERGE_MSG` holds Git's prepared default message while the merge is in progress — reuse it instead of retyping the summary line. If resolving interactively via `git merge --continue`, append the same `Conflicts resolved in:` list to the message in the editor before saving instead.
9. Run the project's test suite when feasible, even if every conflict looked mechanical. A merge with zero leftover markers can still be semantically broken — see "Semantic conflicts" below.

The conflicted-files list in the body is not optional busywork — it is what makes a later `git log` or `git blame` on a file in this merge immediately explain why its history has an extra merge commit and what decision was made there, without needing to re-diff the merge.

### Delete/rename conflicts

Not every unmerged file has markers to read. `git status` may instead show:

- `deleted by us` / `deleted by them` — one side deleted the file, the other modified it. Decide intentionally which intent should win: `git rm <file>` to confirm the deletion, or `git add <file>` to keep the modified version.
- `both added` — both sides independently created a file at the same path. This is rarely a coincidence worth merging as one file — inspect both versions, then either merge the content manually or rename one before adding.
- rename conflicts surfacing as `both modified` when Git's rename detection guessed wrong — confirm the rename target is actually the same logical file on both sides before resolving it as an ordinary content conflict.

Never resolve a delete/rename conflict with `--ours`/`--theirs` reflexively — confirm which side's intent should win before staging.

Useful commands during resolution:

```bash
git status           # list conflicted files
git diff             # inspect unresolved hunks
git merge --abort    # abandon the merge and return to pre-merge state
```

## Choosing what the resolved file should contain

Default assumption: the correct result incorporates both sides' intent — most real conflicts are two valid, independent changes to the same area (e.g., two validation rules added to the same function), and the correct output usually keeps both, not a pick between "ours" or "theirs." Only fall back to picking one side entirely when the two changes are genuinely mutually exclusive (the same value changed two different ways, a rewrite that fully supersedes the other side's edit) — reach for this priority order in that case:

1. **Newest correct business behavior** — if both sides are correct but one is newer, keep the newer one.
2. **Required schema or API compatibility** — preserve contracts that callers depend on.
3. **The branch's intended scope** — do not accidentally absorb unrelated changes from the other side.

### Lockfiles

Do not resolve `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` (or equivalents) conflicts with `--ours` or `--theirs`. Either side can be out of sync with the now-resolved manifest (`package.json`), so picking one side silently reintroduces or drops dependency versions. Regenerate instead:

```bash
# after package.json (and any other manifest) is fully resolved
rm package-lock.json         # or yarn.lock / pnpm-lock.yaml
npm install                  # or yarn install / pnpm install
git add package-lock.json
```

### OURS vs THEIRS for true binary or fully-regeneratable files

For files where line-level merging is not meaningful and there's no manifest to regenerate from (compiled assets, images, other opaque build output):

```bash
# Keep our version entirely
git checkout --ours <file>
git add <file>

# Keep their version entirely
git checkout --theirs <file>
git add <file>
```

Use `--ours` / `--theirs` only when you are certain one side is definitively correct. For most source files, edit the conflict markers manually instead.

## Semantic conflicts

A semantic conflict is a case where the merge completes without markers but the combined code is logically broken — e.g., a function was renamed on one branch while the other branch added new call sites using the old name.

Signs of a semantic conflict:

- Tests fail after a clean merge
- Runtime errors that do not trace back to marker lines
- Business logic that contradicts recent requirements

When you suspect a semantic conflict:

1. Run the full test suite immediately after merge.
2. If tests fail, trace the failure to the merged diff, not to unrelated areas.
3. Fix the semantic issue as a follow-up commit on the same branch — do not amend the merge commit.

## When to escalate

Stop and ask the user before resolving the conflict when any of these conditions are true:

- The conflict spans core business logic and both sides represent valid, competing requirements
- Schema or API contracts are in conflict and the correct resolution is not obvious from the diff alone
- The conflict touches authentication, authorization, or financial calculation logic
- Resolving correctly requires understanding of an ongoing feature or incident not visible in the diff
- The conflict spans an unusually large number of files relative to the branch's stated scope (e.g. 15+) — this usually means the branch diverged for too long or grew past one task; flag it instead of pushing through resolution alone

To detect whether an incident may be in progress, check: does the branch name or any recent commit message reference a support ticket, incident label, on-call mention, or hotfix keyword? If yes, treat it as a potential live incident and escalate regardless of whether the conflict itself looks resolvable.

When escalating, run `git merge --abort` to restore the pre-merge state, then explain exactly which files conflict, what each side contains, and what decision is needed from the user. Do not guess at the correct resolution for high-stakes conflicts. An incorrect merge is harder to detect and fix than a clean conflict marker.

## Shared branch conflicts

If the branch is already shared with teammates, resolve in place and keep the resulting merge commit visible. Do not rewrite history to hide the conflict. The merge commit is the audit record that the conflict was handled intentionally.
