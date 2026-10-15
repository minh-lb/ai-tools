# Plan Traceability and Dependencies

## Map backward from the Specification

| Specification ID | Plan task | Verification |
|---|---|---|
| FR-001 | IMP-03 | IT-01 / AC-001 |
| BR-002 | IMP-02 | UT-02 / AC-002 |
| NFR-001 | IMP-02, IMP-04 | IT-04 / AC-004 |

This is an illustrative mapping, not evidence that the tests exist. If test IDs are unknown, describe the scenario or label it `Planned`.

## Two checks

- **Coverage:** every in-scope requirement maps to a task or an explicit exclusion with rationale.
- **Verifiability:** every important task has a way to prove its outcome; every important acceptance criterion has a planned test/check.

## Dependencies

Number tasks in a sensible execution order; identify blockers, preconditions, and unresolved decisions. Distinguish **required** dependencies from **recommended** sequencing. Do not invent approvals, owners, or release dates.

## When the Specification changes

Check impacts on related tasks/verification; keep IDs stable or document the mapping change. Do not leave Plan references to requirements that no longer exist.
