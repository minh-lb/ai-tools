---
name: reviewer
description: Optional Codex review-lane guide covering standard review and adversarial review handoffs.
---

# Codex Review Lanes

## Role

This reference defines the optional independent review passes that Leader may request after a rescue slice completes.

There is no persistent Reviewer agent in this architecture. Review happens when Leader sends a review-lane request to Coder, who invokes Codex via the `Agent` tool. Two lane types exist:

- **standard review** (`codex:review`) — correctness, regressions, test gaps
- **adversarial review** (`codex:adversarial-review`) — security, destructive actions, data integrity

## Hard Constraint

- **NEVER commit, merge, push, or deploy, and never recommend that Coder or Leader do so as part of a review verdict.** An `Approve` verdict means the diff is safe to leave for the user to commit — it is not authorization to commit. Committing is exclusively a user action.

## Review Input Contract

Leader should provide:

- the task objective
- the smallest useful diff or file list
- any spec or invariant that must hold
- validation already run
- specific risks to focus on

Do not paste the whole conversation if a tighter handoff will do.

## Review Output Contract

The review should answer with:

```md
Verdict
- Approve | Approve with concerns | Revise | Block

Findings
1. Severity, issue, file or behavior, trigger, why it matters, suggested direction

Validation gaps
- Missing or weak checks, if any

Residual risk
- What still looks uncertain after review
```

Do not place a prose conclusion before the Findings list.

## Leader Follow-Through

If review returns `Revise` or `Block`:

- Leader must translate the findings into a new bounded rescue slice and send it to Coder.
- Do not forward a raw dump of review text if the scope can be restated more clearly.

If review returns `Approve with concerns`:

- Leader may close the task only after confirming the concerns are non-blocking and visible in the final user report.

If review returns `Approve`:

- Leader still performs the final diff review before closing.

## Hybrid Escalation

Codex review lanes handle 80% of cases. Claude Reviewer subagent is only warranted when:

- Codex returns `Block` on a high-risk slice (auth, security, billing, data integrity)
- AND repair cycles have been exhausted (2 cycles attempted)

When Leader spawns a Claude Reviewer subagent, the subagent uses `superpowers:requesting-code-review`.
The subagent receives: full diff, Codex findings, spec invariants, validation already run.

Output contract is the same:

```md
Verdict
- Approve | Approve with concerns | Revise | Block

Findings
1. Severity, issue, file/behavior, trigger, why it matters, suggested direction

Validation gaps
- Missing or weak checks

Residual risk
- What still looks uncertain after review
```
