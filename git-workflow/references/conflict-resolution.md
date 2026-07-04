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

## Resolving conflicts

When conflicts appear:

1. Run `git status` to list all conflicted files.
2. For each conflicted file, open it and read both sides of the conflict markers carefully:
   - `<<<<<<< HEAD` — your branch (current)
   - `=======` — divider
   - `>>>>>>> origin/develop` — the incoming branch
3. Resolve each conflict intentionally. Do not blindly accept one side.
4. After editing, verify the file compiles or parses correctly before staging.
5. Stage each resolved file: `git add <file>`
6. Complete the merge:
   - Preferred: `git merge --continue`
   - If unavailable: `git commit` with no `-m` — Git will pre-fill the merge commit message

Useful commands during resolution:

```bash
git status           # list conflicted files
git diff             # inspect unresolved hunks
git merge --abort    # abandon the merge and return to pre-merge state
```

## Choosing which side to keep

Apply this priority when deciding what the resolved file should contain:

1. **Newest correct business behavior** — if both sides are correct but one is newer, keep the newer one.
2. **Required schema or API compatibility** — preserve contracts that callers depend on.
3. **The branch's intended scope** — do not accidentally absorb unrelated changes from the other side.

### OURS vs THEIRS for binary or generated files

For files where line-level merging is not meaningful (lockfiles, generated JSON, compiled assets):

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

To detect whether an incident may be in progress, check: does the branch name or any recent commit message reference a support ticket, incident label, on-call mention, or hotfix keyword? If yes, treat it as a potential live incident and escalate regardless of whether the conflict itself looks resolvable.

When escalating, run `git merge --abort` to restore the pre-merge state, then explain exactly which files conflict, what each side contains, and what decision is needed from the user. Do not guess at the correct resolution for high-stakes conflicts. An incorrect merge is harder to detect and fix than a clean conflict marker.

## Shared branch conflicts

If the branch is already shared with teammates, resolve in place and keep the resulting merge commit visible. Do not rewrite history to hide the conflict. The merge commit is the audit record that the conflict was handled intentionally.
