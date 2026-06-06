# Maintainability

## Focus

Review whether the change keeps the code understandable, localizes complexity, and reduces the probability of future defects.

## Inspect

- Naming clarity and domain vocabulary
- Function size, branching complexity, and hidden state
- Duplication of business logic or policy decisions
- Comment quality, dead code, and feature-flag cleanup
- Encapsulation, cohesion, and module readability
- Error messages and diagnostics for future debugging

## Review Questions

- Will another engineer understand the invariant or intent from the code itself?
- Does the change duplicate logic that will drift later?
- Is complexity growing in the right place or leaking into callers?
- Are important assumptions encoded in code, or only implied by comments or tribal knowledge?
- Does the code make the next likely change safer or riskier?

## Red Flags

- Long functions that mix parsing, policy, persistence, and side effects
- Duplicate conditional logic spread across multiple call sites
- Generic helper abstractions that obscure business meaning
- Commented-out code, stale flags, or TODOs on critical paths
- Ambiguous naming that hides units, ownership, or lifecycle
- Error handling that loses original context

## Evidence

A maintainability finding should identify:

- The source of unnecessary complexity or duplication
- The concrete future risk it creates: inconsistent fixes, harder debugging, or defect-prone edits
- Why it is significant enough to raise during review

## Remediation Direction

- Split responsibilities along domain boundaries
- Centralize duplicated rules behind a single owner
- Rename values to make units, scope, and lifecycle explicit
- Preserve error context and remove stale code paths
