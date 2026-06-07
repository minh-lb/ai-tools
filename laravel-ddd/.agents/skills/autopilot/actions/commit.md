# Commit Action

## Prerequisites

- Code changes must exist in the working tree. If no changes, inform the user there is nothing to commit.
- Read `docs/current-feature.md` to determine active spec type and status.
- Run tests related to this task: read the active spec's `Test Plan` and `Test Cases` (at least all P0/P1 cases) if in context, otherwise identify test files from `git diff --name-only`. Stop if any fail.

## Steps

1. Show files to stage and proposed conventional commit message.
2. Update `docs/current-feature.md` based on current Status:
   - Status `Complete`: `run` has finished all work — clear Active Spec, set Sub-spec Queue to `N/A`, set Status to `Not Started`, move the entry to History.
   - Status `In Progress`: mid-epic commit — `run` already updated the Sub-spec Queue; no changes to `docs/current-feature.md` needed.
3. Stage only files changed for this task plus `docs/current-feature.md` if updated in step 2; never `git add .`.
4. Run `git commit` with the proposed message. If it fails, report the error and stop.
5. Report commit hash and branch.
6. Report which `Test Cases` IDs were verified (especially P0/P1), and list any intentionally deferred cases.
