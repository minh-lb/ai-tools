---
name: reviewer
description: Optional Codex review-lane guide covering standard review and adversarial review handoffs.
---

# Codex Review Lanes

## Role

This reference defines the optional independent review passes that Claude may request after `/codex:rescue` completes.

There is no persistent reviewer teammate in this architecture. Review happens by invoking Codex with one of two commands:

- `/codex:review`
- `/codex:adversarial-review`

## Command Selection

Use `/codex:review` for the default independent review:

- correctness
- regressions
- missing tests or weak validation
- maintainability issues that materially affect confidence

Use `/codex:adversarial-review` when the leader wants Codex to assume the implementation may be unsafe and actively try to break it:

- auth or permission boundaries
- secrets or sensitive data handling
- destructive actions
- money, billing, quotas, or idempotency
- migrations, rollback, or data consistency
- external side effects or deployment behavior

Run both when the risk is high and the change warrants a normal pass plus a hostile pass.

## Review Input Contract

Claude should provide:

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

- Claude must translate the findings into a new bounded `/codex:rescue` slice.
- Do not forward a raw dump of reviewer text if the scope can be restated more clearly.

If review returns `Approve with concerns`:

- Claude may close the task only after confirming the concerns are non-blocking and visible in the final user report.

If review returns `Approve`:

- Claude still performs the final diff review before closing.
