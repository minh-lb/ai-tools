# Commit Convention

## Purpose

Commit convention exists to make history easy to read, review, revert, and automate against.

A good commit should answer three questions quickly:

1. What changed
2. Why it changed
3. Whether it is safe to keep, review, or revert independently

## What a good commit looks like

A good commit is:

- small enough to review in one pass
- focused on one logical change
- named clearly enough to understand without opening the diff
- valid on its own, or at least part of a short sequence of valid commits

Avoid mixing these in one commit unless they are tightly coupled:

- feature logic
- refactor
- formatting-only changes
- dependency updates
- tests for unrelated areas

## Commit message format

Use this format:

```text
<type>(<scope>): <summary>

[optional body]

[optional footer]
```

Required parts:

- `type`: classifies the intent of the change
- `scope`: identifies the affected module, bounded context, or subsystem
- `summary`: short imperative description of the result

Optional parts:

- `body`: explains why the change exists, key tradeoffs, or important implementation notes
- `footer`: carries metadata such as breaking changes, issue references, or follow-up tracking
- do not add any co-author attribution lines in the body or footer

Examples:

```text
feat(payments): add voucher validation API
fix(webhooks): prevent duplicate webhook processing
refactor(checkout): simplify payment service
test(webhooks): add webhook integration tests
docs(deployment): update deployment guide
ci(github-actions): update release workflow
chore(deps): bump package versions
```

Guidelines for the summary line:

- use imperative mood: `add`, `fix`, `remove`, `update`
- keep it short and concrete
- describe the outcome, not the editing activity
- avoid vague words like `update`, `changes`, `misc`, `wip`
- keep the full summary line within 72 characters when possible
- treat 100 characters as a hard ceiling for the summary line

Message length rules:

- summary line: target 50 to 72 characters
- summary line hard limit: 100 characters
- body lines: target 72 characters or fewer per line
- footer lines: target 72 characters or fewer per line

If the summary exceeds the limit, shorten the scope or rewrite the summary. Do not push detail from an overlong summary into vague wording.

Guidelines for `scope`:

- use a stable project term such as a domain, package, app, module, or service
- make `scope` mandatory for this workflow
- keep it short
- do not use a filename unless the repo already follows that convention
- omit noisy or overly broad scopes like `misc`, `stuff`, `various`

Preferred scope choices:

- business or product domain: `billing`, `checkout`, `settlements`
- subsystem or integration: `webhooks`, `auth`, `api`
- platform or tooling area: `deps`, `docker`, `github-actions`, `release`
- repo-wide maintenance: `repo`, `codegen`, `workspace`

For multi-module or repo-wide changes:

- choose the highest common boundary when one clear subsystem dominates
- use `repo` when the change is intentionally repository-wide
- use `deps` for dependency maintenance
- use `release` for release engineering changes that do not fit a product subsystem

If a single commit touches multiple subsystems with no clear dominant scope, split it into one commit per scope rather than using a vague or catch-all scope. One commit should have one clear scope.

If two scopes are equally valid and the correct domain boundary is not obvious from the diff alone — for example, a change that could belong to either `payments` or `billing` — ask the user which scope is correct rather than guessing. An incorrect scope misleads future readers and breaks changelog tooling.

Do not invent a one-off scope for every commit. Reuse stable scope names across the repository.

Good:

```text
feat(billing): add invoice export endpoint
fix(checkout): handle null customer email in checkout
refactor(webhooks): extract retry logic from webhook client
```

Bad:

```text
feat(misc): stuff
fix(code): bug fix
chore(various): update
```

## Preferred types

Use the smallest correct type. Prefer consistency over inventing local variants.

### Core types

- `feat` for adding or expanding product, API, domain, or integration behavior
- `fix` for correcting broken, incorrect, missing, or unsafe behavior
- `refactor` for restructuring code without changing externally observable behavior
- `test` for test-only additions or updates
- `docs` for documentation-only changes
- `ci` for CI pipeline, workflow runner, or automation service changes
- `build` for build tooling, packaging, dependency resolution, or artifact generation changes
- `perf` for behavior-preserving performance improvements
- `style` for formatting-only or presentation-only code changes with no logic impact
- `revert` for reverting a previous commit
- `chore` for maintenance work that does not fit the categories above

### Type selection guide

#### `feat`

Use `feat` when the system can do something new after the change, or when an existing capability is materially extended.

Use `feat` for:

- new endpoints, commands, screens, jobs, consumers, webhooks, or integrations
- new database fields or schema changes that enable new behavior
- new configuration paths that unlock product or platform capabilities
- behavior changes that add supported use cases

Examples:

```text
feat(api): add settlement export endpoint
feat(webhooks): support partial refund events
feat(billing): expose invoice download URL
```

Do not use `feat` for:

- pure bug fixes
- internal-only restructuring
- documentation or test-only updates

#### `fix`

Use `fix` when behavior was wrong, broken, unsafe, incomplete, or inconsistent and the change corrects it.

Use `fix` for:

- incorrect business logic
- failed validation or error handling
- regressions
- race conditions, retry bugs, idempotency bugs
- security fixes when the primary intent is correcting unsafe behavior

Examples:

```text
fix(checkout): handle null customer email
fix(webhooks): prevent duplicate event processing
fix(auth): reject expired password reset tokens
```

Choose `fix` instead of `refactor` if the commit changes behavior, even if it also restructures code.

#### `refactor`

Use `refactor` when the code structure changes but the intended external behavior stays the same.

Use `refactor` for:

- extracting methods, services, or modules
- renaming internal abstractions
- removing duplication
- improving dependency direction or composition

Examples:

```text
refactor(payments): extract retry policy service
refactor(api): move serializer mapping into presenters
```

Do not use `refactor` if:

- a user-visible or API-visible behavior changes
- a bug is being fixed
- the main goal is performance optimization

Branch: if the refactor is bundled with a feature or fix, use the same `feature/*` or `bugfix/*` branch. If the refactor is standalone, use a `chore/*` branch.

#### `test`

Use `test` only when the commit changes tests and nothing else materially changes in production behavior.

Use `test` for:

- adding regression tests
- improving fixtures or test helpers
- replacing flaky assertions
- increasing coverage for existing behavior

Examples:

```text
test(webhooks): cover duplicate event rejection
test(checkout): add cases for guest address validation
```

If the commit adds a feature or fixes a bug and also includes tests, classify by the main intent instead of `test`.

Branch: if the test is directly tied to a feature or fix, use the same `feature/*` or `bugfix/*` branch. If the test is standalone (adding coverage for existing behavior), use a `chore/*` branch.

#### `docs`

Use `docs` for documentation-only changes.

Use `docs` for:

- README, ADR, runbook, API docs, onboarding guide, release notes
- inline documentation comments when they are the only substantive change

Examples:

```text
docs(api): document settlement export filters
docs(runbook): add webhook replay procedure
```

Do not use `docs` when documentation is bundled with a feature or fix commit whose main purpose is behavioral.

#### `ci`

Use `ci` for changes to continuous integration or automation platforms that run repository workflows.

Use `ci` for:

- GitHub Actions, GitLab CI, CircleCI, Buildkite, Jenkins pipeline definitions
- automated release workflows
- lint, test, or deploy jobs executed by CI providers

Examples:

```text
ci(github-actions): run integration tests on pull requests
ci(release): add production tag workflow
```

Use `ci` instead of `build` when the change is about pipeline orchestration, runner behavior, or hosted workflow execution.

#### `build`

Use `build` for changes to build systems, packaging, compile steps, generated artifacts, or dependency management.

Use `build` for:

- package manager lockfile updates when the intent is dependency resolution
- bundler, compiler, transpiler, container build, or release packaging changes
- Makefile, Gradle, Maven, npm, pnpm, Vite, Webpack, Rollup, Docker build logic

Examples:

```text
build(deps): bump aws-sdk to v3.632.0
build(docker): reduce image size by removing dev packages
build(vite): split vendor bundle output
```

Use `build` instead of `ci` when the change affects how software is built, not how hosted automation executes it.

Branch: there is no `build/*` branch prefix. Put `build` commits on a `chore/*` branch.

#### `perf`

Use `perf` for changes whose primary purpose is improving performance without changing intended behavior.

Use `perf` for:

- reducing query count
- removing unnecessary network calls
- caching expensive lookups
- optimizing hot paths or rendering cost

Examples:

```text
perf(api): reduce N+1 queries in settlement listing
perf(cache): memoize exchange rate lookups per request
```

If the optimization also fixes incorrect behavior, decide whether `fix` or `perf` better represents the main intent.

Branch: if standalone, use a `chore/*` branch. If bundled with a feature, use the `feature/*` branch for that task.

#### `style`

Use `style` for changes that affect formatting or presentation only and do not alter logic.

Use `style` for:

- whitespace
- line wrapping
- import ordering
- linter-driven format normalization

Examples:

```text
style(api): format controller imports
style(frontend): normalize JSX wrapping
```

Do not use `style` for CSS or UI visual changes visible to users. Those are usually `feat`, `fix`, or `refactor` depending on intent.

Branch: use a `chore/*` branch for standalone style changes.

#### `revert`

Use `revert` when undoing an earlier commit.

Examples:

```text
revert(payments): revert voucher validation API
revert(auth): revert session token model rename
```

If possible, mention the reverted commit in the body or footer.

Branch: use the same branch prefix as the original commit being reverted. If reverting a `feature/*` commit, open a new `bugfix/*` or `hotfix/*` branch depending on urgency.

#### `chore`

Use `chore` only as a fallback when no stronger type applies.

Use `chore` for:

- repository housekeeping
- editor or workspace config
- non-behavioral maintenance tasks
- generated file refreshes with no meaningful logic change

Examples:

```text
chore(repo): update editorconfig defaults
chore(codegen): regenerate OpenAPI client
```

Avoid using `chore` as a catch-all for unclear commits. If the change clearly adds behavior, fixes behavior, changes build logic, or updates CI, choose the more specific type.

### Common decision rules

1. If behavior changes from wrong to correct, use `fix`.
2. If behavior expands or new capability appears, use `feat`.
3. If structure changes but behavior should stay the same, use `refactor`.
4. If only tests changed, use `test`.
5. If only docs changed, use `docs`.
6. If only formatting changed, use `style`.
7. If the main goal is speed, use `perf`.
8. If the change is about hosted workflows, use `ci`.
9. If the change is about build tooling or dependencies, use `build`.
10. Use `chore` only when none of the above fit.

### Edge cases

If a change could fit multiple types, classify by the main intent of the diff:

- feature plus tests: `feat`
- bug fix plus refactor: `fix`
- performance optimization plus refactor: `perf`
- dependency bump to fix a production issue: `fix` or `build`, depending on whether the point is behavior correction or dependency maintenance
- docs added together with a feature: `feat`
- CI config changed to support a new build tool: choose `ci` if the main work is pipeline execution, `build` if the main work is build mechanics

## Optional body

Use the body when the summary alone is not enough.

The body should explain:

- why the change was needed
- what constraint or bug triggered it
- any important implementation tradeoff
- any migration or operational concern reviewers should know

Keep it concise. Write in complete sentences or short explanatory lines.

Example:

```text
fix(webhooks): prevent duplicate webhook processing

The payment provider can retry delivery for up to 24 hours.
Store the external event ID and reject duplicates before dispatch.
```

## Optional footer

Use the footer for structured metadata, not for repeating the summary.

Typical footer content:

- issue references
- ticket identifiers
- breaking-change notices
- follow-up references

Do not use the footer for:

- any `co-author` or `co-authored-by` attribution
- `Co-authored-by`
- generated attribution lines
- AI tool attribution

Examples:

```text
feat(api): add settlement export endpoint

Refs: FIN-142
```

```text
refactor(auth): rename session token model

BREAKING CHANGE: session token table name changed from auth_tokens to session_tokens
```

## How to split commits

Split commits by logical boundary, not by file count.

Good split:

1. schema or contract change
2. implementation of the new behavior
3. tests
4. documentation or rollout notes

Possible example:

```text
feat(settlements): add payout status column
feat(admin-api): expose payout status in settlements endpoint
test(settlements): cover payout status transitions
docs(admin-api): document payout status field
```

Bad split:

```text
feat: backend part 1
feat: backend part 2
feat: more backend
```

Do not create artificial micro-commits unless they improve reviewability.

## When one commit is enough

One commit is usually enough when:

- the change is small
- the tests are directly tied to the change
- there is no benefit in reviewing intermediate steps

Example:

```text
fix(webhooks): prevent duplicate webhook processing
```

That single commit can include:

- the bug fix
- the regression test
- a small supporting refactor if it is necessary for the fix

## Local cleanup before sharing

Before pushing or opening a PR, clean up noisy local history when appropriate.

This workflow does not permit `git rebase` or `git rebase -i` even for local cleanup, because rebasing rewrites commit history and conflicts with the merge-based update strategy.

Use these safe alternatives instead:

- Amend the most recent commit, **only if it has not been pushed to remote yet**: `git commit --amend`. If the commit is already on the remote, do not amend — add a follow-up commit instead.
- Fix a specific earlier unpushed commit: create a new fixup commit describing what it corrects, then rely on squash merge at PR time to collapse it into one clean commit.
- Remove a debug-only commit that has not been pushed: `git revert <sha>` to keep history forward-moving.

Target outcome:

- each visible commit should have a clear purpose
- the branch should read like a coherent implementation story
- do not use `git rebase`, `git rebase -i`, `git rebase --continue`, or `git rebase --abort` at any stage

## Before committing

Run relevant checks for the project, for example:

```bash
composer test
npm test
phpstan
eslint
```

Also verify:

1. Only intended files are staged
2. No debug artifacts remain
3. No secrets or machine-local files are included
4. The commit message matches the real intent of the diff

Remove debug code such as:

```text
dd()
dump()
var_dump()
print_r()
console.log() used only for debugging
```

Never commit:

```text
.env
credentials
tokens
private keys
```

## AI-assisted commit rules

When AI helps produce code, do not assume the diff is logically grouped just because the tool produced it in one pass.

Before committing:

1. Review the staged diff manually
2. Split unrelated hunks into separate commits
3. Rewrite generated commit messages if they are vague — amend the commit if it has not been pushed yet, or add a corrective follow-up commit if it has
4. Confirm tests match the behavior that actually changed

AI-generated code should be held to the same or higher bar than human-written code because it often changes more files than necessary.

Do not add co-author attribution for AI assistance. The commit author must remain the human owner of the change. Commit messages and squash messages must not include any `Co-authored-by` or co-author lines — not in the summary, body, or footer.
