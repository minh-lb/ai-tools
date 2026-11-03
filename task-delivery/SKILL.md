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

1. **Preflight — Orchestrator.** Confirm repo, branch, existing dirty changes, instructions, task boundaries, acceptance criteria and safe local test commands. Ask only about material ambiguities or unsafe verification.
2. **Design.** Reuse approved spec/plan. Use **document-rule** and Superpowers design guidance when relevant; obtain required approval for material architecture/behavior decisions. A small bugfix needs only a short plan.
3. **Coder.** Dispatch a bounded assignment with allowed paths and acceptance evidence. Use **coding-rule**, plus **domain-driven-design** or **react-component-generator** only for matching code. Apply **superpowers:test-driven-development** when available; record meaningful choices and deviations.
4. **Tester.** Verify the stable updated tree independently with relevant targeted, regression and applicable lint/typecheck/build/E2E checks. Use **testing-rule** for browser execution and **testcase-creator** only when creating cases/automation is in scope. Return exact results, failures, and gaps; never hide flaky failures.
5. **Reviewer.** Assign a fresh, independent read-only review of the actual task diff, tests and requirements. Invoke **review-code** explicitly in embedded mode when available; pass the dirty baseline and previous finding IDs. Require evidence-backed severities and disposition.
6. **Auto-fix.** Validate failures/findings before dispatching Coder corrections. After every code/test/config edit, rerun affected tests and an independent re-review on the new tree. Cap corrections at **3 rounds** after the initial implementation. Notes/report-only changes do not invalidate application tests if behavior is unchanged.
7. **Handoff.** Inspect final task diff, git status and `git diff --check` where applicable. Explain behavior, decisions/tradeoffs, spec deviations, precise test/review evidence, correction history and open risks. Leave work uncommitted for human review.

Read [agent contracts](references/agent-contracts.md) before dispatching subagents or deciding an iteration result. Use [handoff template](templates/task-delivery-report.md) for the final response or a document when the user requests one. If the existing **implementation-notes** skill is available, use it for the task's decision log; otherwise provide an equivalent concise decision section without creating an arbitrary file.

## Selective skill routing

Only load the specialist needed **for the current stage**; the steps above name each default. Read [agent contracts](references/agent-contracts.md) before dispatching, but pass each subagent only its role, task scope, evidence, and necessary reference—never the full parent history or every Skill. Specialized rules complement, not replace, acceptance criteria and local project checks. Use Superpowers only where installed and compatible with the no-worktree/no-auto-commit boundary. **team-mini** is a separate team-boot workflow; never create a second orchestrator.
## State and stopping rules

| Status | Use only when |
| --- | --- |
| **READY_FOR_HUMAN_REVIEW** | Acceptance criteria checked, required local tests verified on the final tree, no blocking review findings, and explanations/evidence supplied. This does not imply human approval or deployment readiness. |
| **NEEDS_INPUT** | A user choice/approval materially affects behavior, security, or scope. |
| **BLOCKED** | Safety, permissions, missing tools/environment, or unresolved external dependencies prevent responsible progress. |
| **LIMIT_REACHED** | Three attempted correction rounds completed and an actionable failure/finding remains. |

Never convert a skipped, unavailable, flaky, or failed check into PASS. State precisely what was and was not verified.