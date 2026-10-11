---
name: reviewer
description: Optional Codex review-lane guide covering standard review and adversarial review handoffs.
---

# Optional Independent Review Lanes

## Role

This reference defines the optional independent review handoff after an implementation slice. It is not a requirement to use Codex or a separate reviewer.

There is no persistent Reviewer agent in the default team. A review may be requested only when an independent tool is actually available, authorized, and appropriate. If the host provides Codex review lanes, a Coder can relay the request through the documented adapter; do not assume `Agent`, `codex:review`, or `codex:adversarial-review` exists. Useful review intents include:

- **Standard review** — correctness, regressions, and important test gaps.
- **Adversarial review** — security, destructive effects, data integrity, and recovery.

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
