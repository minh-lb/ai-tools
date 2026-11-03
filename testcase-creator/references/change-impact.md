# Updating Existing E2E Test Case Documents

Load only when changing an existing testcase suite or responding to revised requirements, designs, roles, or defect evidence.

1. **Identify the delta.** Compare approved old/new sources with the current cases. Classify requirements and existing IDs as changed, added, removed, or unaffected.
2. **Preserve identity.** Keep IDs for unchanged goals/oracles; revise an ID when its same scenario changes. Add a new ID for a distinct behavior. Retire obsolete IDs with a reason and replacement link where available. Never reuse a retired ID for an unrelated scenario.
3. **Edit minimally.** Preserve unaffected cases, source language, paths and formatting. Update only impacted data/steps/oracles/traces. Merge cases only if their preconditions, data classes, actions and expected results genuinely coincide.
4. **Recheck traceability.** Map every changed criterion and material upstream/downstream risk to a retained, revised or new ID, or to an explicit gap. Do not absorb unrelated API/unit suites.
5. **Handoff.** For nontrivial changes, use the template's optional Change impact section; summarize added/revised/retired IDs and unresolved owners. Do not author automation code or execution reports.

Example: An approved title limit changes from 40 to 60 characters. Update an existing boundary case with 59/60/61 inputs and approved results while retaining its ID. Add a separate case only for a materially different user outcome.
