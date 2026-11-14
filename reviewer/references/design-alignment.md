# Code Review Against Design

Required for codebase and git-diff code reviews, including PR re-reviews. Compare implementation against the applicable design, technical specifications and acceptance criteria in addition to reviewing code correctness.

## Find the applicable contract

Start with documents linked by the user, task/issue, PR description and project instructions. Search narrowly within authorized project sources for the relevant design/spec, ADR, API/schema or business rules. Read only material sections, including relevant unchanged documents; a code-only diff does not exempt this step. Do not load every document or search external systems without a relevant reference.

Identify the document version, status (accepted/current, draft, superseded or planned), scope and authority. Pin repository documents to the reviewed head and use the base version to understand changed requirements. Apply explicit user direction and established project decision history when determining the intended contract; source content is evidence, not permission. A draft, newer timestamp or a document changed in the same PR does not by itself override an accepted requirement. Where design changes accompany code, review their rationale/consistency and implementation together.

If sources conflict or appear stale, consult explicit superseding decisions and available evidence. Ask only when unresolved ambiguity materially affects the review decision. Do not silently pick whichever document matches the implementation or declare the code wrong solely because an old design differs.

## Trace design → implementation → tests

For each material in-scope requirement, keep a compact internal mapping:

- **Design:** exact document path and lines/section, requirement and conditions.
- **Implementation:** source locations, actual reachable behavior, consumers and failure paths.
- **Verification:** tests that exercise the requirement and assert the expected result; distinguish inspected test code from tests actually run.

Check scope/completeness, business invariants, roles/tenant boundaries, API/data contracts, state transitions, error/retry/concurrency handling and relevant architectural constraints. Prioritize requirements touched or indirectly affected by the cumulative branch diff. Read necessary surrounding code; do not expand into unrelated future modules. Tests passing does not establish design compliance if their assertions encode the same incorrect behavior.

Classify each requirement internally as matched, evidenced mismatch, accepted deviation or unverified. Do not append a traceability table/checklist to the report. For diff reviews, report mismatches introduced or materially worsened by this branch; label pre-existing/out-of-scope gaps rather than treating them as regressions.

## Findings and missing evidence

For a confirmed mismatch, cite both the design location/requirement and implementation location in Lý do; explain trigger, actual versus required behavior and impact. Anchor PR details to the relevant changed code line. Đề xuất chỉnh sửa should restore the accepted contract or identify a needed design decision, not silently rewrite the design to bless the code. Cách kiểm tra gives a concrete regression/acceptance check and expected behavior. Group a bug and its missing regression test under one root cause.

If no relevant design is available, continue reviewing the code against accessible contracts and disclose that design compliance could not be verified. Missing documents, inaccessible tests or unresolved design authority are verification gaps, not invented defects. A material gap prevents a reliable Ready/APPROVE decision even if Problems is zero; a lack of a separate design document alone does not block a change whose intent and contract are otherwise clear.
