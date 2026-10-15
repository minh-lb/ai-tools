---
title: "<Feature name> — E2E Test Cases"
type: testcase
feature_id: "<Existing feature ID if available>"
display_language: "<User/project language>"
status: draft # Use the repository's testcase lifecycle if established.
updated: YYYY-MM-DD
sources: [] # Approved specifications, acceptance criteria, designs, contracts, and rules. Do not list locally authored demos or fixtures as approved sources.
playwright_automation: "<relative path to the paired Playwright file>"
---

<!-- Remove instructional comments and unused optional sections in generated files. Preserve existing file language; do not translate IDs, schema keys, API names, or literal UI copy. Replace the automation placeholder with an actual relative Markdown link to the paired file. If no approved requirement basis is available, say so; do not promote local examples, fixtures, or implementation into approved sources. -->

# <Feature name> — E2E Test Cases

## Scope and sources
- **Playwright automation:** `<relative Markdown link to paired file under docs/autotests/>`
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
- **Expected outcome / postcondition:** <approved observable result and persisted read-back when required>
- **Trace:** <every in-scope acceptance-criterion and test-condition ID covered>
- **Risk / priority rationale (optional):** <brief, evidence-based rationale>

## Coverage gaps / exclusions (optional; include only when nonempty)
- **Criterion / condition:** <ID>
  - **Reason / owner:** <why it is uncovered or excluded; who can resolve or accept it>

## Pending decisions (optional; include only when nonempty)
- **Affected case ID:** <...>
  - **Unresolved oracle / evidence:** <...>
  - **Owner / source needed:** <...>

## Exploratory charters (optional; separate from deterministic pass/fail cases)
### <charter-id> — <Objective>
- **Observation focus:** <...>
- **Scope, data, and setup:** <...>
- **Timebox / safety / cleanup:** <...>
- **Risk / incident trace:** <...>

## Exploratory run notes (optional; after charter execution only)
### Run notes — <charter-id>
- **Date / tester / environment:** <...>
- **Observations / evidence:** <...>
- **Follow-up defects or E2E case IDs:** <...>

## Execution records (optional; deterministic cases only)
### Run <run-ID> — <case-id>
- **Date / tester / build / environment:** <...>
- **Result:** <approved project value>
- **Actual result / redacted evidence:** <...>
- **Defect / follow-up:** <...>
