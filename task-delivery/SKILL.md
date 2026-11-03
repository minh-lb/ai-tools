---
name: task-delivery
description: Use when the user asks an AI agent to complete a software task end-to-end in the current local checkout, especially when implementation must be followed by automated testing, independent code review, bounded bug-fix loops, and a human-readable handoff.
---

# Task Delivery

One user-facing orchestrator session owns a task from requirements to a verified local handoff. Assign implementation, testing, and review to separate bounded subagents when the host supports them. **Clean code is not the same as a task the human understands.** Explain consequential decisions and provide evidence for every completion claim.

## Fixed operating boundaries

- Work in the user's **current Git working directory and current branch**. Do not create or switch Git worktrees, branches, or clones. This rule overrides optional worktree suggestions from other workflows.
- Do not commit, stage, push, open PRs, deploy, or call remote production/staging services without separate explicit authorization. "Local" describes execution, not a guarantee that commands have no side effects.
- Preserve unrelated/uncommitted user files. If **git-workflow** is available, load it before the first Git operation, while honoring this skill's stronger current-checkout constraints. Before editing, capture branch, git status, and the relevant baseline diff; never reset, checkout, clean, stash, or overwrite user changes to make tests pass.
- Respect project instructions and existing test tooling. Inspect commands and targets before running them; do not execute destructive database resets, external writes, data migrations, or unsafe cleanup without approval.
- One parent session controls sequencing and decisions. Subagents have their own bounded contexts; they are **not** extra user-facing sessions. Only one Coder may write at a time. Tester and Reviewer must never edit application files.
- If subagent/delegation tools are absent, disclose this before work. Continue sequentially only if the user accepts a single-agent fallback. Never label self-review as independent review.

## Execute the task

1. **Preflight — Orchestrator.** Identify repository, branch, user-owned dirty changes, relevant instructions, task scope, and the existing test environment. Establish acceptance criteria and what evidence will prove them. Ask about unresolved choices that materially change behavior or make local verification unsafe.
2. **Design — Orchestrator.** Use **document-rule** when applicable; reuse approved spec and plan. For material features or architectural changes, use Superpowers brainstorming/planning when available and obtain required design approval before coding; for bounded bug fixes, use a short plan. Never let a planning skill silently create a worktree or commit.
3. **Implement — Coder.** Delegate a precise bounded slice, task-only file scope, acceptance criteria, and test commands. Use **coding-rule** when available; add **domain-driven-design** or **react-component-generator** only for applicable code. Use **superpowers:test-driven-development** for behavior changes when available: demonstrate a failing relevant test, implement minimally, and re-run. Record important decisions, alternatives, and spec deviations as they occur.
4. **Verify — Tester.** On the stable updated tree, use **testing-rule** for relevant browser/E2E journeys; use **testcase-creator** only when creating/updating E2E cases is in scope, with its cases-only or automation mode selected from the request. Independently execute the targeted tests, appropriate regression suite, and relevant lint/typecheck/build/E2E checks supported by the local environment. Collect exact commands, exit codes, failures, test scope, and limitations. A passing targeted test alone is not full verification. Investigate flaky or environment-related failures; never rerun until green and hide previous failures.
5. **Review — Reviewer.** Invoke **review-code** by name in embedded task-delivery mode when available, with the exact task-scoped source, baseline dirty state, acceptance criteria, and prior finding IDs; otherwise perform the same independent review contract and disclose capability gaps. Read the actual diff and acceptance criteria independently, including changed tests, security, correctness, interfaces, edge cases, maintainability, and regressions. Report actionable findings with severity, file/line evidence, and reproduction or reasoning. Reviewer is read-only. Do not treat a Coder's explanation as review evidence.
6. **Fix loop — Orchestrator.** If Tester fails or Reviewer has a blocking finding, validate it and assign a narrowly scoped correction to Coder. After every correction, rerun Tester on the **new final tree**, then re-dispatch Reviewer on that same tree. Allow **at most 3 correction rounds** after initial implementation; a round counts when Coder starts an attempted fix. Do not reuse an outdated PASS or review verdict after any code/test/config modification. Changes limited to standalone notes/review reports do not invalidate application test evidence unless they affect runtime/test behavior; check the actual diff. Stop for unsafe scope, missing authority, unresolvable environment, or exhausted rounds.
7. **Human handoff — Orchestrator.** Inspect final task diff and git status; check for accidental changes and run git diff --check when applicable. Deliver the final status, clear logic/flow explanation, key decisions with tradeoffs, deviations from approved requirements, actual test/review evidence, fix-round history, and unresolved risks. Leave files uncommitted for the human to inspect.

Read [agent contracts](references/agent-contracts.md) before dispatching subagents or deciding an iteration result. Use [handoff template](templates/task-delivery-report.md) for the final response or a document when the user requests one. If the existing **implementation-notes** skill is available, use it for the task's decision log; otherwise provide an equivalent concise decision section without creating an arbitrary file.

## Integration with other skills

- **Superpowers**: use brainstorming/planning for design, test-driven-development for implementation, systematic-debugging for failures, and requesting/receiving-code-review for reviewer exchange **only when those skills/tools exist**. Explicit user constraints above override incompatible worktree/auto-commit procedures; skip those incompatible procedures and disclose any material lost capability.
- **Git:** load **git-workflow** before inspecting status/diff if available, but never let its optional branch/worktree recipes override the current-checkout rule.
- **Coder:** use **coding-rule** as the default; use **domain-driven-design** or **react-component-generator** only for matching project architecture/component tasks.
- **Tester:** use **testing-rule** for browser/E2E execution and **testcase-creator** only when authored test cases/automation are needed. Existing project test commands remain the primary source.
- **Reviewer:** explicitly delegate **review-code** in embedded mode when available. Standalone review reports remain optional; never run two competing reviewer/orchestrator workflows.
- **Documentation:** use **document-rule** for substantive specs/plans and **implementation-notes** for decisions when available. Use **generate-flow** only on an explicit request for a separate flow document. Skill loading must not create extra artifacts implicitly.
- Do not invoke **team-mini** as a second orchestrator for the same task.

## State and stopping rules

| Status | Use only when |
| --- | --- |
| **READY_FOR_HUMAN_REVIEW** | Acceptance criteria checked, required local tests verified on the final tree, no blocking review findings, and explanations/evidence supplied. This does not imply human approval or deployment readiness. |
| **NEEDS_INPUT** | A user choice/approval materially affects behavior, security, or scope. |
| **BLOCKED** | Safety, permissions, missing tools/environment, or unresolved external dependencies prevent responsible progress. |
| **LIMIT_REACHED** | Three attempted correction rounds completed and an actionable failure/finding remains. |

Never convert a skipped, unavailable, flaky, or failed check into PASS. State precisely what was and was not verified.