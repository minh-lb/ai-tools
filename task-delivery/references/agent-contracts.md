# Local task-delivery: agent contracts

Load this when assigning roles, evaluating test or review output, or starting a correction round.

## Orchestrator — single parent session

Input: user task, approved requirements, current local checkout, project instructions.

Responsibilities:
1. Capture baseline: branch, git status, baseline diff, task-owned change scope. Avoid confusing pre-existing dirty edits with new task changes.
2. Define outcome-oriented acceptance criteria and safe verification plan.
3. Provide each subagent its own bounded context: task, current requirements, relevant paths, explicit prohibitions, expected return fields. Avoid flooding contexts with irrelevant prior conversation.
4. Serialize application-file writes. Freeze changes while Tester or Reviewer reads them. If application code, test or runtime config changes, invalidate the affected evidence and rerun gates. Purely narrative notes/review-report edits do not invalidate runtime evidence when confirmed unrelated to behavior.
5. Track the correction counter starting at zero. Increment it when a new fix attempt is assigned after initial implementation. Stop automatically before round four.
6. Judge findings and conflicting evidence, request user decisions as needed, deliver one consolidated final response.

Subagents are logical roles, not promises about a particular model/CLI. Inspect the host's actual capability and invocation instructions. Do not invent a model name, tool, subagent, or independent session. Use a fresh Reviewer context each review round when possible.

## Coder — only application-file writer

**Assignment must include:** acceptance criteria; allowed paths/scope; baseline/dirty-file warnings; tests to add/run; local-only constraints; applicable coding-rule/specialist guidance; spec/decision note expectations; outstanding finding IDs in fix rounds.

**Return:**
- Changed paths and behavioral summary, linked to requirements.
- Failing regression test before fix (where TDD applies), then passing targeted result.
- Decisions not prescribed by the spec, alternatives, tradeoffs, and approved deviations.
- Exact commands and outputs run; remaining uncertainty.
- No claim of overall task completion.

Implement the smallest correction for each validated finding. Do not broaden scope, weaken assertions, remove failing tests, silently modify unrelated files, commit, or reset user changes.

## Tester — independent evidence, no source editing

**Input:** stable task diff, acceptance criteria, known local test commands, local safety constraints, unresolved test failures. Use testing-rule only for relevant E2E journeys; use testcase-creator only when E2E testcase documents are explicitly in scope; route automated test code to a separate implementation step.

**Return:**
- Check | command | exit code | result (PASS/FAIL/BLOCKED/SKIPPED/FLAKY) | scope/evidence.
- Reproduction steps for failures and whether they are task-introduced, pre-existing, or unresolved.
- Local environment and mocked/external boundaries; cleanup or test data side effects.
- Coverage gaps and recommended follow-up; no auto-fixes.

Run relevant targeted tests, applicable regression suite, and build/lint/typecheck as the project provides. For user-facing journeys, run actual local UI/E2E verification when authorized and feasible. Don't equate a mocked test with a real browser path.

## Reviewer — independent read-only quality gate

**Input:** acceptance criteria, final changed diff (not just summary), pre-task dirty baseline, relevant code/tests, previous finding IDs and fix descriptions. Invoke review-code explicitly in embedded task-delivery mode when available; produce the review in the agent response, not a new file.

**Return:**
- Finding ID, calibrated severity (Critical / High / Medium / Low), separate blocking flag (`true` / `false`), exact file/location, concrete defect/risk, supporting reasoning or repro, minimal remediation. Medium–Critical defects are normally blocking; justify any exception.
- Requirements gaps, security/performance/compatibility risks that are relevant to the diff.
- Disposition of every previous blocking finding: RESOLVED, OPEN, or UNVERIFIED.
- Verdict: **NO_BLOCKING_FINDINGS**, **CHANGES_REQUIRED**, or **REVIEW_INCOMPLETE**.
- Unreviewed scope and any missing evidence.

Review only problems supported by evidence. Distinguish proposed improvements from real defects. Don't duplicate the Coder's self-review.

## Corrective loop

Initial implementation → Tester → Reviewer → final gate.

When an actionable test failure or blocking review finding occurs:

1. Orchestrator verifies the issue; do not "fix" unsupported or flaky assertions blindly.
2. If current rounds = 3, set LIMIT_REACHED; preserve evidence and stop.
3. Increment rounds and dispatch Coder with exact finding IDs and reproduction.
4. Freeze writes; Tester reruns all newly impacted gates and the applicable regression suite.
5. Reviewer re-examines the updated diff and previous findings independently.
6. If code, tests, or runtime configuration change after these gates, invalidate affected results and return to verification. A report-only change is not a reason to rerun the suite; confirm it has no effect on runtime/tests. Do not claim clean based on stale evidence.

Stop for NEEDS_INPUT/BLOCKED whenever continuing requires a consequential user decision or unsafe action. Non-blocking suggestions are recorded for human consideration and do not force endless polishing.

### Example

Round 0: New checkout implementation; local tests PASS; Reviewer finds BLOCKING R-01 (duplicate charge path).

Round 1: Coder adds reproduction test and fixes duplicate path; Tester runs targeted + regression tests; fresh Reviewer marks R-01 RESOLVED, identifies no other blockers. Orchestrator checks final diff and hands off as READY_FOR_HUMAN_REVIEW with 1/3 correction rounds used.

If independent agents are unavailable, mark the review as **self-review only** and obtain user agreement before proceeding; do not claim the normal independent-review gate has passed.