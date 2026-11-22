---
title: "<Feature name> — E2E Test Cases"
type: testcase
feature_id: "<Existing feature ID if available>"
display_language: "<User/project language>"
status: draft # Use the repository's testcase lifecycle if established.
updated: YYYY-MM-DD
sources: [] # Approved specifications, acceptance criteria, designs, contracts, and rules. Do not list locally authored demos or fixtures as approved sources.
---

<!-- Remove instructional comments and unused optional sections in generated files. Preserve existing file language and IDs, schema keys, API names, and literal UI copy. If no approved requirement basis is available, state the gap; do not promote local examples or implementation behavior into approved sources. This template produces testcase documentation only. -->

# <Feature name> — E2E Test Cases

## Scope and sources
- **E2E boundary:** <user goal; product entry → observable end state>
- **Approved sources:** <links/IDs and versions>
- **Actors / environment:** <roles, supported client, approved URL or app deep link>
- **Shared setup / data:** <only what applies>
- **Cleanup / exclusions:** <only what applies>

## E2E scenarios
<!-- One structured entry per deterministic user goal, not a table. Every action must be executable without guessing. -->

### <case-id> — <User goal / scenario>
- **Preconditions:** <actor/session, permissions, initial state, and setup>
- **Test data:** <exact inputs, fixture IDs, approved credential-store alias; never secrets>
- **User actions:**
  1. Open <approved test URL + route or app deep link>; verify <starting screen>.
  2. <Name each navigation target/control and resulting screen/URL.>
  3. <Enter exact values, select the named control, and verify each material transition.>
- **Expected outcome / postcondition:** <exact observable result; read-back and absence of unintended changes if applicable>
- **Trace:** <every in-scope acceptance-criterion and test-condition ID covered>
- **Risk / priority rationale (optional):** <brief, evidence-based rationale>

## Coverage gaps / exclusions (optional; include only when nonempty)
- **Criterion / condition:** <ID>
  - **Reason / owner:** <why it is uncovered or excluded; who can resolve or accept it>

## Change impact (optional; only when updating an existing suite)
- **Changed requirement(s):** <source/ID and version>
- **Case IDs:** <retained/revised, new, retired with reason or replacement link>

## Pending decisions (optional; include only when nonempty)
- **Affected case ID:** <...>
  - **Unresolved oracle / evidence:** <...>
  - **Owner / source needed:** <...>

