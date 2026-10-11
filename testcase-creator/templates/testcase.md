---
title: "<Feature name> — E2E Test Cases"
type: testcase
feature_id: "<Existing feature ID if available>"
display_language: "<User/project language>"
status: draft # Use the repository's testcase lifecycle if established.
updated: YYYY-MM-DD
sources: [] # approved specs, AC, versioned designs/contracts, BR/E/EC
---

<!-- Remove instructional comments and example entries from the generated file. Translate human-readable text to display_language; keep IDs, YAML keys, controlled values, and technical identifiers unchanged. -->

# <Feature name> — E2E Test Cases

## Scope and sources
<!-- Keep concise; retain only facts needed to understand or reproduce these journeys. -->
- User goal / E2E start → end: <...>
- Approved sources and versions: <links/IDs>
- Actors, roles, and permissions: <...>
- Environment, supported client, and approved test base URL / native-app deep link: <...>
- Shared starting state: <...>
- Shared test data / fixtures: <...>
- Cleanup, safety, and material exclusions: <only what applies>

## E2E scenarios
<!-- Use structured lists, not a Markdown testcase table. One user/business goal per deterministic case. Use separate Preconditions and Test data fields. Make User actions executable without guessing: start with an approved URL/route or app deep link, specify navigation targets, control labels, exact values, submit actions, and resulting screens/URLs. Include sign-in steps when auth is in scope; otherwise state the authenticated session in Preconditions. Do not invent routes or controls, and never put credentials/session tokens in this file. -->

### <case-id> — <User goal / scenario>
- **Preconditions:** <actor/session, permissions, required initial state, setup>
- **Test data:** <concrete inputs, fixture IDs, approved credential-store reference if needed; never the secret itself>
- **User actions:**
  1. Launch <browser/app> and open <approved test base URL + route or native-app deep link>; verify <starting screen>.
  2. <If login is in scope: follow the approved sign-in/SSO procedure at the documented route, identify the test account, retrieve any secret only through the approved credential-store alias, complete required factors, and verify the signed-in state; otherwise omit and use the authenticated-session precondition. Never write the secret itself.>
  3. <Navigate via the named control/link or approved route; state the resulting screen/URL.>
  4. <Enter exact test values, submit using the named control, and verify the next screen/URL.>
- **Expected outcome / postcondition (oracle):** <observable UI/end-state; required side effect only if needed>
- **Trace:** <approved source/test condition>
- **Risk / priority rationale:** <evidence-based priority and concise rationale>

## Pending decisions (optional; include only when nonempty)
- **Affected journey / case ID:** <...>
  - **Unresolved expected outcome or evidence:** <...>
  - **Owner / source needed:** <...>
  - **Impact:** <...>

## Exploratory charters (optional; separate from deterministic pass/fail cases)
<!-- A charter has an observation goal, not an expected result. Never assign it a pass/fail result. -->

### <charter-id> — <Charter objective>
- **Observation focus:** <...>
- **Scope, data and setup:** <...>
- **Timebox / safety / cleanup:** <...>
- **Risk / incident / trace:** <...>

## Exploratory run notes (optional; include only after charter execution)
<!-- Record observations and follow-ups, not pass/fail. Convert findings into defects or deterministic E2E cases with approved oracles. -->

### Run notes — <charter-id>
- **Date / tester / environment:** <...>
- **Timebox:** <...>
- **Observations / anomalies / evidence:** <...>
- **Follow-up defects or E2E case IDs:** <...>

## Execution records (optional; deterministic E2E cases only)
### Run <run-ID> — <case-id>
- **Date / tester:** <...>
- **Build / environment:** <...>
- **Result:** <Use the repository's approved execution-result values>
- **Actual result / redacted evidence:** <...>
- **Defect / follow-up:** <...>
