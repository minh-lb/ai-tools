---
name: code-review
description: "Structured code review across 7 dimensions: correctness, readability, maintainability, performance, security, error handling, and convention."
argument-hint: diff|file|pr
---

# Code Review

Review `$ARGUMENTS` (a diff, file path, or PR description) against the 7 dimensions below.

## Review Dimensions

### 1. Correctness (always — highest priority)
- Identify bugs, off-by-one errors, wrong conditions, missing null/edge-case handling.
- Check that all expected cases are covered (happy path, empty input, boundary values, concurrent access if relevant).
- Flag any wrong business logic by comparing against the spec or surrounding code intent.

### 2. Readability
- Variable and function names must clearly express intent. Flag generic names (`data`, `temp`, `x`).
- Functions/methods should do one thing. Flag functions that mix concerns.
- Complex expressions should be broken into named intermediates.

### 3. Maintainability
- Flag hard-coded literals that should be constants or config values.
- Identify duplicated logic that violates DRY. Suggest extraction only when the duplication is non-trivial (≥ 3 occurrences or complex logic).
- Check that the change can be extended or modified without cascading rewrites.

### 4. Performance (basic)
- Flag N+1 query patterns (lazy-loaded relationships in loops, repeated DB calls inside iterations).
- Flag redundant loops, unnecessary re-computation, or missing eager-loading.
- Do not flag micro-optimizations unless there is evidence of a hot path.

### 5. Security (must-have)
- Flag unvalidated user input flowing into DB queries, shell commands, file paths, or HTML output.
- Check for SQL injection, XSS, SSRF, insecure deserialization, and mass-assignment risks.
- Flag exposed secrets, tokens, or credentials — even in comments.
- Verify authorization checks are present on sensitive operations.

### 6. Error Handling
- Flag missing try/catch around I/O, external calls, and parsing.
- Check that errors are logged with enough context to diagnose in production.
- Ensure errors propagate or surface appropriately; silent swallowing is a bug.

### 7. Convention / Style
- Compare against `docs/coding-standards.md`. Flag deviations.
- Check formatting consistency with surrounding code (indentation, naming convention, bracket style).
- Flag dead code, stale comments, or debug statements left in.

## Output Format

For each finding use:

```
[DIMENSION] SEVERITY — location (file:line if available)
Problem: <what is wrong>
Fix: <concrete suggestion>
```

Severity levels: `BLOCKER` | `MAJOR` | `MINOR` | `NIT`

- **BLOCKER**: bug, security hole, data corruption risk — must fix before merge.
- **MAJOR**: significant readability, maintainability, or performance issue.
- **MINOR**: correctible but low-risk gap.
- **NIT**: style or preference; fix only if trivial.

After all findings, print a **Review Summary** with counts per severity and an overall verdict:
`APPROVE` | `APPROVE WITH MINOR NOTES` | `REQUEST CHANGES`

## Rules

- Always run dimensions 1 (Correctness) and 5 (Security) — never skip them.
- Do not invent problems. Only flag issues visible in the provided diff or file.
- Provide a concrete fix suggestion for every BLOCKER and MAJOR finding.
- Do not duplicate rules from `docs/coding-standards.md`; reference them by name instead.
