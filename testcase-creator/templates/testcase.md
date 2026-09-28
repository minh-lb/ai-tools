---
title: "<Feature name> — Test Cases"
type: testcase
display_language: "" # Set to en or vi after confirming with the user
feature_id: "<Stable feature ID>"
feature_slug: "<feature-slug>"
module: "<domain/module>"
service_components: [] # participating UI/API/services/data stores/jobs/queues
suite_owner: "<team or person>"
shared_suites: [] # canonical linked suite IDs; do not duplicate shared cases
tags: [qa, testcase, "feature/<feature-slug>"]
status: draft # draft | review | approved
priority: high # critical | high | medium | low
owners: []
updated: YYYY-MM-DD
sources: [] # approved spec, AC, design version, API contract, BR/E/EC links; no placeholders when approved
platforms: [frontend, backend] # keep both even if one is N/A
coverage: [] # requirement/group IDs actually considered; include justified N/A and exclusions
---

<!-- Remove all instructional HTML comments from the generated file. Translate human-readable headings and placeholder prose to the confirmed display_language; keep YAML keys, controlled values, IDs, and technical identifiers unchanged. -->

# <Feature name>

## Scope and evidence
- Description / capability / entry points: <...>
- Design/version, API/version, AC/BR/E/EC, NFR: <link or missing>
- Actor × permissions × tenant/ownership: <...>
- States/transitions and input data: <...>
- Requirements/AC and owning team: <stable IDs / team>
- Service/component boundaries and dependencies (versions/contracts): <...>
- Build/version, release, environment, browser/device/OS, locale/timezone, config/flags: <...>
- Dataset, account/role/tenant, setup/starting state, dependencies/tools: <...>
- Cleanup/reset and safety constraints (especially destructive/external effects): <...>

## Coverage matrix
| Requirement/risk/dimension | Applicable variants / service or contract version | Case IDs or N/A (reason) | Exclusions/gaps/owner |
| --- | --- | --- | --- |
| Input/boundaries/Unicode/malicious data | <...> | <...> | <...> |
| Actor/permissions/tenant | <...> | <...> | <...> |
| State/sequence/time | <...> | <...> | <...> |
| Concurrency/retry/dependency/volume | <...> | <...> | <...> |
| NFR/integration | <...> | <...> | <...> |

## Frontend
<!-- Remove this comment when generating a file. If no UI exists, state N/A and the evidence-based reason. Consider access, title/GUI/default, each element's Default/Validation/Event, flow/state, accessibility, responsive, and i18n. One observable objective per case; link/version the design for GUI checks. -->
| ID | Type / level | Group / element | Preconditions, setup & data | Steps | Expected UI (oracle) | Link/Trace | Risk/Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-<FEATURE>-FE-001 | <functional / E2E> | <group/element> | <actor, state, value, setup> | 1. <action> | <specific observable result> | <AC/design/BR> | <high> |

## Backend
<!-- Remove this comment when generating a file. If no backend exists, state N/A and the evidence-based reason. Negative cases specify expected DB/cache/message/log state; positive cases verify side effects too. -->
| ID | Type / level | Group | Preconditions, setup & data | Auth | Request / trigger steps | Expected response (status + schema/body) | Side effects (DB/cache/queue/log before → after) | Trace | Risk/Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-<FEATURE>-BE-001 | <API / integration> | <group> | <record/tenant/state, setup> | <actor/token> | <METHOD /path headers body> | <approved response oracle> | <no change / specific state to verify> | <BR/E/EC/contract> | <high> |

## Related integration & NFRs
<!-- Remove this comment when generating a file. Cross-feature cases belong in the initiating flow or link to a shared suite; avoid duplication. Distinguish FE and BE measurement thresholds. -->
| Objective | FE / BE oracle | Threshold / measurement / environment | Case ID or link | Coverage note / N/A rationale |
| --- | --- | --- | --- | --- |
| <flow/performance/security/operations> | <...> | <...> | <...> | pending-spec |

## Readiness register
<!-- Keep readiness separate from the FE/BE test case tables and from execution results. -->
| Case ID | Design readiness (ready/pending-spec/blocked/N/A) | Reason / decision needed |
| --- | --- | --- |
| <TC-ID> | <pending-spec> | <missing oracle / owner / evidence> |

## Open questions / coverage gaps
| Question or gap | Blocked cases | Owner / source needed | Risk |
| --- | --- | --- | --- |
| <...> | <...> | <...> | <...> |

## Review summary
- Design readiness: ready <n>; pending-spec <n>; blocked <n>; N/A (with reason) <n>.
- Coverage method/denominator: <requirements, transitions, risks considered; method/strength>.
- Explicit exclusions, untested paths, residual risks and owners: <...>.

## Execution records (separate from case design; link an external run log if used)
| Release / run ID / date / tester | Requirement → feature → case IDs | Build & environment / dependency mode | Result (not-run/passed/failed/blocked/not-applicable/inconclusive) | Actual result & redacted evidence | Defect ID / notes |
| --- | --- | --- | --- | --- | --- |
| <release/run> | <REQ → FEATURE → TC-ID> | <build/env/provider mode> | not-run | <actual/evidence link> | <defect or note> |
