# {Name}

**Type:** feature | fix
**Epic:** {link to epic spec | N/A}

## Overview
{What problem this solves and the intended outcome.}

## Requirements
{Original user requirement, verbatim.}

## Goals
- {Concrete verifiable goal}

## Input
| Input | Type | Required | Description |
| --- | --- | --- | --- |
| {name} | {type} | yes/no | {description} |

## Output
- Given {condition}, when {action}, then {expected result}.

## Design Analysis
<!-- OMIT this entire section for backend-only or non-UI specs. Include only for user-facing UI work. If design input was provided, separate visible facts from assumptions. -->

### Shared Design Contract
- {Applicable product-wide guidance from `docs/design.md`: tone, layout defaults, token constraints, recurring component patterns, or "None".}
- {Any intentional deviation from the shared design contract for this feature, or "None".}

### Design Source Precedence
- {Primary screen-level design reference for this feature, or "None".}
- {Which shared decisions still come from `docs/design.md`, or "None".}

### Visible Facts
- {Layout regions, controls, text, data, states, and visual hierarchy observed directly in the image.}

### Visual Style Breakdown
- {Color system: brand/primary/secondary/neutral/surface/text/border/semantic colors and state variants.}
- {Typography: font family, scale, weight, line-height, letter spacing, text emphasis hierarchy.}
- {Look and feel: corner radius, borders, elevation/shadows, gradients/patterns, icon style, density, whitespace rhythm.}
- {Motion cues: hover/active/focus/loading transitions and perceived interaction feedback.}

### Component Inventory (Design vs Codebase)
- {Components detected in design: page sections, cards, forms, tables, nav, modals, widgets.}
- {Shared components already available in codebase that can be reused directly.}
- {Shared components missing from codebase and required to be created.}
- {Mapping to Tailwind composition vs CSS Module components, with reuse priority.}

### Component Reuse Audit (Mandatory)
- {For each needed component, check existence in `components/` and record reuse/no-reuse result.}
- {For current page container, check existence in `containers/<current-page-container>/components/` and record reuse/no-reuse result.}
- {Placement decision per component with reason: `components/` (preferred when reusable across multiple places) or container-local components (only when page-private).}

### Implementation Assumptions
- {Assumptions about routes, data, interactions, responsive behavior, design-system mappings, and token approximations when exact values are unknown.}
- {Fallback behavior used when `docs/design.md` is missing, partial, or intentionally unspecified.}

### Visual Acceptance Targets
- {Reference used for acceptance: screen-level source or `docs/design.md` + existing app.}
- {Chosen screen type from the density usage map.}
- {Chosen density tokens for controls, rows, typography, and spacing.}
- {Reason for any density escalation beyond the compact default, or "None".}
- {Viewports to verify and why.}
- {States to verify and why.}
- {Allowed intentional deviations, or "None".}

### Open Questions
- {Only questions that would change behavior, files, or tests. Use "None" if safe assumptions were made.}

## Flow
{Use only relevant Mermaid sequence/flowchart diagrams. Omit if not useful.}

## UI/UX Notes
{Components/routes to create/modify, primary user workflow, responsive requirements, accessibility needs, and loading/empty/error/success states. Omit for backend-only specs.}

## Business Rules
- {Validation, authorization, constraints, side effects}

## Implement Plan

<!-- Rule: one production file per step. Include a direct paired test file only when needed. Max 7 steps (1–7 = simple spec; 8+ = use Epic path). -->

1. {Step}: `{exact/file/path}` — {one-line technical decision}
   - Depends on: {step N | none}
   - Verify: {how to confirm this step is complete}

## Test Plan
- Unit: {Utility functions and Server Actions}
- Lint: `npm run lint` must pass
- Typecheck: `npm run typecheck` must pass
- Build: `npm run build` must pass
- E2E/Browser: {Playwright E2E scenarios when configured; user-facing workflows, responsive viewports, and interaction states to verify}

## Test Cases
| ID | Level | Scenario | Preconditions | Steps | Expected Result | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | Unit/Integration/UI/E2E | {What behavior is verified} | {State, permissions, input data} | {Numbered test steps} | {Observable outcome and assertions} | P0/P1/P2 |

<!-- Include both success and failure paths. At minimum cover: happy path, input validation, auth/authz, edge cases, and one regression-risk scenario. -->

## Out of Scope
- {Explicit exclusions}

## Status

<!-- Valid values: Not Started | In Progress | Complete -->
<!-- Do not use "Active" here; that is only for Sub-spec Queue rows. -->

Not Started
