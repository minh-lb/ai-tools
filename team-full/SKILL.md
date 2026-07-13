---
name: team-full
description: Boot a full Claude Code + Codex agent team with Leader and Tester agents. TDD-first workflow — spec → testcases → tests → implement → verify → review. Coder and Reviewer are Codex on-demand. Use only when the user explicitly asks for "team-full".
metadata:
  author: Minh Luu
---

# CC Team Full

Boot a full multi-agent team. Once booted, the Leader orchestrates a structured TDD workflow through 5 phases with explicit approval and handoff gates.

## Activation

Use only when the user explicitly asks for `team-full`.

Do not auto-apply to ordinary coding, debugging, or single-agent tasks.

## Boot Sequence

`/team-full` only boots the team. It does NOT start any task. The user provides the task after boot.

When invoked:

1. Use `TeamCreate` to create Claude agents:
   - **Leader** — model: `claude-sonnet-4-6`, loaded with `references/leader.md`
   - **Tester** — model: `claude-sonnet-4-6`, loaded with `references/tester.md`

   > Coder and Reviewer are Codex — invoked on-demand, model managed by Codex.
2. Report team ready:
   ```
   CC Team Full booted.
   - Leader:            ready (claude-sonnet-4-6)
   - Tester:            ready (claude-sonnet-4-6)
   - Coder (Codex):     on-demand via /codex:rescue
   - Reviewer (Codex):  on-demand via /codex:review or /codex:adversarial-review
   Provide your task to begin.
   ```
3. Wait for the user to provide a task.
4. When the user provides a task: send it to Leader via `SendMessage`.
5. Enter relay loop:
   - When Leader sends output (spec for approval, status updates, questions, final report): display it to the user verbatim.
   - When the user replies: forward the reply to Leader via `SendMessage`.
   - Continue until Leader signals task complete or hits a stop condition.

## Phases (run by Leader after task received)

### Phase 1 — Analysis & Spec

Leader analyzes the task, designs system architecture and database schema, then writes to `docs/features/<feature-name>/spec.md`.

**Gate**: Leader presents the spec to the user and waits for explicit approval before proceeding to Phase 2.

### Phase 2 — Test Design

Leader sends spec to Tester via `SendMessage`. Tester writes test cases to `docs/features/<feature-name>/testcase.md`.

Leader reviews the test cases:
- If cases are missing or wrong: send back to Tester for revision (max 2 rounds).
- If approved: Leader instructs Tester to write the actual tests:
  - Unit tests for business logic
  - Integration tests with a real test database (not mocks)

### Phase 3 — Implementation

Leader reads the tests, then uses `/codex:rescue` to implement the feature. Read `references/coder.md` before preparing each handoff.

Implementation must satisfy all written tests — no skipping or modifying tests to pass.

### Phase 4 — Verification

Leader runs all tests. If any fail:
- Send a repair slice to `/codex:rescue` (max 2 repair cycles).
- If still failing after 2 cycles: escalate to the user.

Proceed to Phase 5 only when all tests pass.

### Phase 5 — Code Review

Leader invokes Codex review lanes. Read `references/reviewer.md` before preparing the handoff.

- Default: `/codex:review` — correctness, architecture, code quality
- High risk (auth, financial, security-critical): `/codex:adversarial-review` — Codex actively tries to break the implementation
- Run both when blast radius is large

Codex reviewer can run linters, security scanners, and `git diff` on the actual codebase.

If review returns `Revise` or `Block`: Leader sends a targeted repair to `/codex:rescue`, re-runs affected tests, and re-submits for review. Max 2 repair-and-resubmit cycles. If review still does not pass after 2 cycles: escalate to the user with the full findings and current state.

Leader closes the task only after review passes and all tests still pass.

## Runtime Assumptions

- `TeamCreate` and `SendMessage` are available.
- Codex surfaces: `/codex:rescue` required; `/codex:review` and `/codex:adversarial-review` required for Phase 5.
- If `TeamCreate` is unavailable: Claude acts as Leader and Tester sequentially and states the limitation.
- If `/codex:rescue` is unavailable: stop at Phase 3 and escalate — implementation cannot proceed without Codex.
- If `/codex:review` / `/codex:adversarial-review` is unavailable: notify the user, then Leader performs a manual diff review using `references/reviewer.md` as a checklist and documents the gap in the final report.

## Read Order

1. Read `references/leader.md` — full orchestration workflow.
2. Read `references/tester.md` — before any Tester handoff.
3. Read `references/coder.md` — before each `/codex:rescue` handoff.
4. Read `references/reviewer.md` — before Reviewer handoff.

## Stop Conditions

Escalate to the user instead of continuing when:

- spec is too ambiguous after 2 clarification attempts
- tests cannot be written without resolving a design conflict
- implementation cannot pass tests without changing the spec
- a security issue found in review has no safe fix within scope
- a required command surface is unavailable with no fallback

## Completion Criteria

- spec.md written and approved by user.
- testcase.md written, reviewed by Leader, approved.
- All unit and integration tests pass.
- Implementation satisfies the spec without modifying tests.
- Codex review passed (`/codex:review` or `/codex:adversarial-review`).
