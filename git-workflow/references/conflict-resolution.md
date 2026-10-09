# Conflict Resolution

## Sync from the correct base first

Before starting a merge, inspect `git status` and `git branch --show-current`. Do not merge with unrelated staged/unstaged/untracked changes or while another merge, rebase, cherry-pick, or revert is in progress. Preserve unrelated work; do not stash or discard it automatically. Before resolving any conflict, make sure the branch is being merged from the correct base. Examples use `develop` as the integration branch; replace it with the repository's verified integration branch if different. Use `<fetch-remote>` for the authoritative remote containing the intended base ref. In a fork, do not assume the writable push remote is the correct merge base or infer either role from `origin`/`upstream` names.

For `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*` — sync from `develop`:

```bash
git fetch <fetch-remote>
git merge <fetch-remote>/develop
```

For `hotfix/*` — sync from the configured production branch, not the integration branch:

```bash
git fetch <fetch-remote>
git merge <fetch-remote>/<production-branch>
```

## Confirm what operation is actually in progress

This workflow resolves merge conflicts only. Rebase and cherry-pick conflicts are outside scope; identify them with `git status`, stop without editing conflicted files or running an operation-specific continue/abort command, and ask the user how they want to proceed.

```bash
git status
```

- `"You have unmerged paths"` / `"All conflicts fixed but you are still merging"` → a merge is in progress. Proceed with the steps below.
- `"interactive rebase in progress"` → a rebase is in progress. This workflow does not use rebase and does not use `git rebase --abort` either (see `references/principles.md` — it is on the forbidden list along with the rest of the rebase family). Stop and explain that the branch has an in-progress rebase from outside this workflow; do not edit files or run a rebase command. Let the user decide how to exit it.
- `"You are currently cherry-picking"` → cherry-pick conflict. This workflow does not resolve cherry-pick conflicts: stop and ask the user how to proceed. Do not use merge-specific commands, and do not run `git cherry-pick --continue` or `git cherry-pick --abort` without explicit user instruction.

## Resolving conflicts

When a merge conflict appears:

1. Run `git status` to list all conflicted files.
2. For each conflicted file, open it and read both sides of the conflict markers carefully:
   - `<<<<<<< HEAD` — your branch (current)
   - `=======` — divider
   - `>>>>>>> <fetch-remote>/<branch-being-merged>` — the incoming branch
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
8. Before running `git merge --continue`, verify `git status` reports a merge in progress and `git rev-parse -q --verify MERGE_HEAD` succeeds. If either check fails, or status identifies a rebase, cherry-pick, revert, or unclear operation, stop—do not run `git merge --continue` or substitute another operation's continue command. Inspect the current branch, ensure every conflict is resolved and staged, review the staged diff, and run relevant checks. If the current branch is the configured production or integration branch, obtain explicit user confirmation for this specific merge commit; until confirmation is received, do not run the continue command. Keep Git's default summary line (`Merge branch '<x>' into <y>`), then append a `Conflicts resolved in:` list naming each conflicted file and briefly how it was resolved. Use the prepared merge message and editor:
   ```bash
   git rev-parse -q --verify MERGE_HEAD
   git status
   git branch --show-current
   git diff --cached
   git rev-parse --git-path MERGE_MSG
   git merge --continue
   ```
   The `--git-path` command returns the correct message path even in linked worktrees. `git merge --continue` opens the configured editor with that prepared message; edit it there, then save and close the editor. Do not assume `.git/MERGE_MSG` is a valid path in a linked worktree.
9. Run the project's test suite when feasible, even if every conflict looked mechanical. A merge with zero leftover markers can still be semantically broken — see "Semantic conflicts" below.

The conflicted-files list in the body is not optional busywork — it is what makes a later `git log` or `git blame` on a file in this merge immediately explain why its history has an extra merge commit and what decision was made there, without needing to re-diff the merge.

### Delete/rename conflicts

Not every unmerged file has markers to read. `git status` may instead show:

- `deleted by us` / `deleted by them` — one side deleted the file, the other modified it. Decide intentionally which intent should win: `git rm <file>` to confirm the deletion, or `git add <file>` to keep the modified version.
- `both added` — both sides independently created a file at the same path. This is rarely a coincidence worth merging as one file — inspect both versions, then either merge the content manually or rename one before adding.
- rename conflicts surfacing as `both modified` when Git's rename detection guessed wrong — confirm the rename target is actually the same logical file on both sides before resolving it as an ordinary content conflict.

Never resolve a delete/rename conflict with `--ours`/`--theirs` reflexively — confirm which side's intent should win before staging.

Useful commands during a positively identified merge:

```bash
git status           # identify the operation and list conflicted files
git diff             # inspect unresolved hunks
```

Only if `git status` and `git rev-parse -q --verify MERGE_HEAD` confirm this is an active merge, the user chooses to abandon it, and inspection confirms aborting will not discard pre-existing work, run:

```bash
git merge --abort
```

Do not run merge-specific commands when the operation is a rebase, cherry-pick, revert, or is unclear. Aborting a merge may not restore unrelated pre-existing work.

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
git restore --ours -- <file>
git add <file>

# Keep their version entirely
git restore --theirs -- <file>
git add <file>
```

These commands replace the conflicted file with one side and discard the other side's content. First verify `<file>` is actually conflicted and inspect both versions and their history. Run either command only after the user explicitly approves that exact side for that file; this is an intentional exception to the normal no-discard rule in [Principles](principles.md). For most source files, edit the conflict markers manually instead.

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

When escalating, stop and explain which files conflict, what each side contains, and what decision is needed. Do not automatically abort: first identify the operation and check whether there was uncommitted work before it began; aborting can discard that work. Leave the operation unchanged until the user decides. If the user asks to abort a confirmed merge, use `git merge --abort` only after confirming that doing so will not lose pre-existing changes. This workflow does not abort rebase or cherry-pick operations.

## Shared branch conflicts

If the branch is already shared with teammates, resolve in place and keep the resulting merge commit visible. Do not rewrite history to hide the conflict. The merge commit is the audit record that the conflict was handled intentionally.
