# Coding Standards

Shared source of truth for agent and project rules.
Skills should reference rule IDs here instead of duplicating full text.

## Agent Rules

- `AGENT.MINIMAL_CHANGE`: smallest change that satisfies the requirement.
- `AGENT.SCOPED_READS`: read only relevant files; avoid repo-wide scans unless needed.
- `AGENT.SINGLE_SOURCE`: keep routing in workflows, domain rules in skills, skeletons in templates.
- `AGENT.CONTRACT_STABILITY`: preserve public contracts unless user requests breaking change.
- `AGENT.UNRELATED_FILES`: do not reformat or modify unrelated files.
- `AGENT.SAFE_OPERATIONS`: do not add dependencies, change `.env`, alter public API, or run destructive DB operations without approval.
- `GATE.WORKFLOW_OWNERSHIP`: approval gates are defined by the active workflow.

## Spec Rules

- `SPEC.ATOMIC_STEPS`: each step in `Implement Plan` must cover exactly one production file. The paired test file may be included only when it directly verifies that production file. If a spec exceeds ~7 steps, use the Epic path (epic + sub-specs).
- `SPEC.SPLIT_THRESHOLD`: before writing a spec, assess complexity. Use the Epic path if **any** applies: >3 distinct user flows, >1 domain module affected, or estimate >7 implementation steps. Sub-specs run sequentially; each must be a complete committable unit and may assume prior sub-specs are merged — never assume another sub-spec is in-progress.
- `SPEC.SPEC_STATUS`: valid spec file status values are `Not Started` | `In Progress` | `Complete`. Do not use `Active` here — that is only for sub-spec queue rows.
- `SPEC.FEATURE_STATUS`: valid `docs/current-feature.md` Status values are `Not Started` | `Spec Written` | `In Progress` | `Complete`.
- `SPEC.SUB_SPEC_STATUS`: valid sub-spec queue row status values are `Not Started` | `Active` | `Complete`.

## Commit Rules

- `COMMIT.APPROVAL`: ask before committing; use conventional commits.
- `COMMIT.SCOPED_STAGE`: stage only task files; never `git add .`.
- `COMMIT.NO_AI_ATTRIBUTION`: no AI attribution in commit messages. Never add `Co-Authored-By: Claude` or any AI co-author trailer.

## Laravel Backend Rules

- `LARAVEL.CTRL_THIN`: FormRequest validation -> DTO creation -> UseCase call -> ApiResponse return.
- `LARAVEL.DOMAIN_ACTION_OWNS_RULES`: Domain `*Action` owns business rules and state transitions.
- `LARAVEL.USECASE_ONE_ACTION`: `*UseCase` orchestrates one Action; no business logic.
- `LARAVEL.API_RESPONSE_ONLY`: controllers use `ApiResponse`, not `response()->json()`.
- `LARAVEL.INFRA_ROLE`: infrastructure contains Eloquent models, repository impls, providers, and adapters.
- `LARAVEL.CROSS_DOMAIN_EVENTS`: cross-domain communication uses Domain Events.
- `LARAVEL.CROSS_MODULE_EVENTS_ONLY`: cross-module imports limited to published Domain Events.
- `LARAVEL.DOMAIN_NO_INFRA`: domain code does not depend on Eloquent/HTTP/Facades/infrastructure.
- `LARAVEL.MODEL_INFRA_ONLY`: Eloquent models live only in `Infrastructure/Models`.

## Test Rules

- `TEST.BEHAVIOR_FIRST`: test behavior, not implementation details.
- `TEST.DOMAIN_UNIT`: Domain tests are unit tests with mocked repository contracts.
- `TEST.APP_INTEGRATION`: Application tests are integration tests with real test DB and event assertions.
- `TEST.HTTP_FEATURE`: HTTP tests are feature tests for validation, response shape, and auth.
- `TEST.EVENT_IDEMPOTENT`: run event handlers twice with same event and assert idempotency.
- `TEST.RISK_PRIORITIZATION`: prioritize by business/regression risk, not coverage percentage.

## Error Handling

- `ERROR.THREE_ATTEMPTS_STOP`: after 3 failed attempts on same fix, stop and report root cause, attempts, and blocker.
