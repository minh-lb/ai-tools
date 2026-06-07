# Coding Standards

Source of truth for shared rule IDs plus code, test, and commit rules in target applications using this kit. Skills should reference these rule IDs instead of duplicating full text; workflows route work and define gates. Agent behavior rules live in `AGENTS.md`.

## Shared Rule IDs

### Agent Rules

- `AGENT.MINIMAL_CHANGE`: make the smallest change that satisfies the requirement.
- `AGENT.SCOPED_READS`: read only relevant files; avoid repo-wide scans unless needed.
- `AGENT.SINGLE_SOURCE`: keep routing in workflows, domain rules in skills, and skeletons in templates.
- `AGENT.CONTRACT_STABILITY`: preserve public contracts unless the user requests a breaking change.
- `AGENT.UNRELATED_FILES`: do not reformat or modify unrelated files.
- `AGENT.SAFE_OPERATIONS`: do not add dependencies, change `.env`, alter public APIs, or run destructive operations without approval.
- `AGENT.KEBAB_CASE_PATHS`: when creating new folders/files, use `kebab-case` for directory names and filename stems unless a framework/tool requires a fixed filename (for example `page.tsx`, `layout.tsx`, `index.tsx`, `README.md`).
- `GATE.WORKFLOW_OWNERSHIP`: approval gates are defined by the active workflow.

### Spec Rules

- `SPEC.ATOMIC_STEPS`: each `Implement Plan` step targets exactly one production file. Include the paired test file only when it directly verifies that production file.
- `SPEC.SPLIT_THRESHOLD`: use an epic plus sub-specs when work has more than 3 distinct user flows, affects more than 1 domain module, or needs 8 or more implementation steps.
- `SPEC.IMAGE_INPUT_ANALYSIS`: when one or more images are provided, inspect them before writing the spec and capture visible structure, UI states, text, layout, responsive assumptions, reusable components, and open questions.
- `SPEC.IMAGE_FACTS_VS_INFERENCES`: separate what is directly visible in the image from implementation assumptions; ask a clarification only when an unknown would change files, behavior, or tests.
- `SPEC.SPEC_STATUS`: valid spec status values are `Not Started` | `In Progress` | `Complete`. Do not use `Active` inside a spec file.
- `SPEC.FEATURE_STATUS`: valid `docs/current-feature.md` status values are `Not Started` | `Spec Written` | `In Progress` | `Complete`.
- `SPEC.SUB_SPEC_STATUS`: valid sub-spec queue status values are `Not Started` | `Active` | `Complete`.

### Next.js Architecture Rules

- `NEXT.SERVER_DEFAULT`: use Server Components by default.
- `NEXT.CLIENT_ONLY_WHEN_NEEDED`: use `'use client'` only for interactivity, hooks, or browser APIs.
- `NEXT.DATA_DIRECT`: fetch data directly in Server Components when possible.
- `NEXT.SERVER_ACTIONS`: use Server Actions for form submissions and simple mutations.
- `NEXT.API_ROUTES_WHEN_HTTP_CONTRACT`: use API routes for webhooks, uploads with progress, long-running operations, specific HTTP status/header behavior, mobile/CLI clients, or third-party integrations.
- `NEXT.VALIDATE_WITH_ZOD`: validate all external input with Zod.

### Styling Rules

- `STYLE.STACK_PRIORITY`: use Tailwind CSS first, CSS Modules second.
- `UI.TAILWIND_FIRST`: implement all UI primitives with Tailwind CSS utility classes; only fall back to CSS Modules when Tailwind cannot express the required style (e.g. complex keyframe animations, pseudo-element hacks).
- `TAILWIND.V4_CSS_CONFIG`: Tailwind CSS v4 configuration belongs in CSS with `@theme`; do not create `tailwind.config.ts` or `tailwind.config.js`.
- `UI.EXISTING_SYSTEM_FIRST`: match the existing app layout, component density, spacing, typography, and interaction patterns before adding new visual language.
- `UI.ACTUAL_EXPERIENCE_FIRST`: build the requested usable screen or workflow first; do not replace app work with a marketing/landing page unless explicitly requested.
- `UI.ACCESSIBLE_CONTROLS`: interactive controls need semantic elements, visible focus states, keyboard access, and accessible labels when icon-only.
- `UI.RESPONSIVE_STABLE`: layouts must work on mobile and desktop without text overlap, clipped controls, or layout shift from dynamic labels/states.
- `UI.FEEDBACK_STATES`: user-facing flows need appropriate loading, empty, error, disabled, and success states.
- `UI.VISUAL_VERIFY`: when changing user-facing UI, verify in browser when a dev server/test harness is available and report any unverified viewport risk.
- `UI.DESIGN_SOURCE_PRECEDENCE`: for a given screen, explicit screen-level design evidence overrides product-wide defaults; use product-wide design rules only for unresolved shared decisions.
- `UI.VISUAL_ACCEPTANCE`: for user-facing UI, define required viewports/states, compare against the active design reference, and report matched aspects, deviations, and unverified risks.
- `UI.DENSITY_DECLARATION`: for user-facing UI, declare the chosen screen type and density tokens in the spec and final report; if density escalates beyond the default compact choice, document the reason.
- `UI.IMAGE_MATCH`: when implementing from an image, preserve the visible hierarchy, layout rhythm, component intent, and interaction affordances while adapting to the repo's existing design system.

### Commit Rules

- `COMMIT.APPROVAL`: ask before committing; use conventional commits.
- `COMMIT.SCOPED_STAGE`: stage only task files; never `git add .`.
- `COMMIT.NO_AI_ATTRIBUTION`: no AI attribution or AI co-author trailers in commits.
- `COMMIT.BUILD_GATE`: run `npm run build` before committing; fix all errors first.

### Test Rules

- `TEST.BEHAVIOR_FIRST`: test behavior, not implementation details.
- `TEST.RELATED_FIRST`: run new and related tests before broad checks when a test runner is configured.
- `TEST.RISK_PRIORITIZATION`: prioritize by business and regression risk, not coverage percentage.
- `TEST.GAP_DISCLOSURE`: if a focused test is impractical, document the gap and run the strongest available check.

### Error Handling

- `ERROR.THREE_ATTEMPTS_STOP`: after 3 failed attempts at the same fix, stop and report root cause, attempts, and blocker.

## Implementation Defaults (Concise)

- Use the Rule ID sections above as the single source of truth (`AGENT.*`, `SPEC.*`, `NEXT.*`, `STYLE/UI.*`, `COMMIT.*`, `TEST.*`, `ERROR.*`).
- In skills/workflows, reference Rule IDs instead of restating rule text.
- Default stack expectations: TypeScript strict, React functional components, Next.js App Router, Tailwind v4 CSS config, Zod for external input.
- Keep diffs minimal/scoped, and keep naming aligned with `AGENT.KEBAB_CASE_PATHS`.
