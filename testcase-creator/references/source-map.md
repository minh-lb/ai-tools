# E2E Scope and Expected-Result Rules

This skill produces **one E2E user-journey case set**, not separate frontend and backend suites. Each deterministic case begins at a product entry point and asserts an approved user-visible outcome. Include a cross-layer effect (persistence, notification, job completion, etc.) only when it is part of the user outcome; prefer a UI/product read-back over database inspection.

## E2E case fields

Each case entry in the template's E2E scenarios list contains:

- `ID`: a short stable identifier following the repository's convention. If none exists, use a concise suite-local example such as `TC-001`; when referenced outside the file, pair it with the feature ID or suite path.
- `User goal / scenario`: one independently verifiable end-to-end objective.
- `Preconditions`: actor/permissions, required starting state, and setup needed before user actions.
- `Test data`: concrete input values and fixture records, separately from preconditions.
- `User actions`: numbered actions detailed enough to execute without guessing. Begin at the approved test base URL plus route (or native-app deep link), then name each navigation target/control, exact test value, submit action, and resulting screen/URL. Include explicit sign-in steps when login is part of the tested journey; otherwise state the authenticated session as a precondition. Never include credentials or session tokens—use an approved secret-store alias. Do not invent undocumented URLs or control labels; use approved UI navigation from a known route or record a pending decision if the route is essential. Include fixture resets between parameterized data variants when needed. Each case is a short-ID heading with labeled fields, not a table row.
- `Expected outcome / postcondition`: approved, observable result. Prefer UI/read-back evidence; add a narrowly scoped read-only backend assertion only if an important in-scope effect cannot otherwise be observed.
- `Trace`: approved source and applicable test condition.
- `Risk / priority rationale`: evidence-based priority with a concise reason; keep it separate from source traceability.

## Test basis and oracle

Prioritize the approved test basis: specification/acceptance criteria → versioned design and role/ownership rules → API contract when it affects the journey → business/error/edge-case registers → relevant architecture/current implementation. Code is evidence of current behavior, not the source of truth when it conflicts with an approved requirement. Link each deterministic case to its source and applicable test condition. Do not infer UI messages, redirects, status codes, permissions, persistence, retry behavior, or error policy from conventions.

If a required user outcome is unresolved, do not invent an oracle: record the journey as `pending-spec` with its owner/source in the optional Pending decisions section. A separate API contract/authentication/database test may be referenced by suite ID, but do not duplicate its direct-request steps in this E2E file.

## Cross-layer verification boundaries

- Start with user actions and end with product-visible behavior. A refresh/list/detail read-back is usually stronger and less coupled than inspecting internal tables.
- Use read-only backend verification only when required by the approved outcome and not observable through the product. Name the authoritative state, environment, and safe query/fixture mechanism.
- A UI case may cover the user's permission experience, but hiding a control does not prove API authorization. Direct unauthorized requests, schema/status checks, transaction invariants, and isolated security probes belong in a separate backend/API suite.
- API calls may be used for setup/cleanup, or as the entry point only when the product journey is genuinely API-native. A pure endpoint call is not an E2E case.

## Optional documentation sections

- Keep Scope and sources to entry/exit point, approved links, actors/data, environment, cleanup, and material exclusions.
- Add Pending decisions only when a journey is genuinely blocked on an oracle/source/owner. Do not keep empty gaps or review-summary sections.
- Exploratory charters are not deterministic pass/fail cases. Record objective, observation focus, scope/data, timebox, safety, and risk/incident trace in the optional charter list. When run, record observations and follow-ups in separate exploratory run notes; never mark a charter passed/failed. Turn findings into defects or deterministic E2E cases with approved oracles.
