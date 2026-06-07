# Frontend Design Contract (Core)

Core product-wide visual contract for user-facing UI work in the target application.

## Purpose

- Keep recurring visual decisions in one place so different specs and agents produce consistent UI.
- Capture product-specific design direction only.
- Keep this core file compact for lower token load on most UI tasks.
- Do not duplicate implementation rules already owned by `docs/coding-standards.md` or `.agents/skills/frontend-coding-rules/SKILL.md`.

## How To Use

- Read this file for user-facing UI work before writing or implementing a frontend spec.
- Prefer explicit values from this file over generic defaults.
- If a section is intentionally blank, fall back to the existing application UI and any task-specific design input.
- If a provided screenshot/Figma/mockup conflicts with this file, the screen-level source wins for that screen.
- Load `docs/design-extended.md` only when the task needs detailed density, spacing, component-default, or motion guidance.

## Design Source Precedence

1. Screen-level design source for the current screen or state.
2. This file for shared product-wide tokens, defaults, and recurring patterns.
3. Existing application patterns when neither source defines the decision.
4. Generic library defaults only when higher-precedence sources are silent.

## Product Tone

- Product type: `B2B dashboard / admin tool`
- Tone keywords: `calm`, `focused`, `technical`, `trustworthy`, `efficient`, `compact`
- Visual direction summary: `Prefer a clean operator-facing interface that feels reliable, compact, and fast to scan. Visual emphasis should come from hierarchy, spacing, and restrained color usage instead of decorative surfaces, oversized sections, or marketing-style composition.`

## Layout Defaults

- App shell: `sidebar-first on desktop, stacked header + content on mobile`
- Content width: `full width for data-heavy pages; centered max width only for forms, settings, or focused setup flows`
- Section rhythm: `compact-by-default`
- Preferred grouping: `tables, list rows, tabs, inline filters, structured forms, side panels, and lightweight cards only when grouping is genuinely helpful`

## Color System

- Primary tokens:
  - `--color-primary-50: #eff6ff`
  - `--color-primary-600: #2563eb`
  - `--color-primary-700: #1d4ed8`
- Accent tokens:
  - `--color-accent-50: #ecfeff`
  - `--color-accent-600: #0891b2`
- Surface tokens:
  - `--color-bg-app: #f8fafc`
  - `--color-bg-surface: #ffffff`
  - `--color-bg-muted: #f1f5f9`
- Text tokens:
  - `--color-text-strong: #0f172a`
  - `--color-text-body: #1e293b`
  - `--color-text-muted: #64748b`
- Border tokens:
  - `--color-border-subtle: #e2e8f0`
  - `--color-border-strong: #cbd5e1`
- Semantic tokens:
  - `--color-success: #16a34a`
  - `--color-warning: #d97706`
  - `--color-danger: #dc2626`
  - `--color-info: #2563eb`

## Typography

- Font family: `--font-sans: Geist, Inter, system-ui, sans-serif`
- Heading scale:
  - `--text-h1: 22/30, 600` for page title only
  - `--text-h2: 18/26, 600` for major sections
  - `--text-h3: 15/22, 600` for sub-panels
- Body scale:
  - `--text-body-sm: 14/20, 400` for dense data UI
  - `--text-body-md: 16/24, 400` for form-heavy flows
  - `--text-label: 12/18, 500`
  - `--text-helper: 12/16, 400`
- Weight usage: `regular for body copy, medium for labels and navigation, semibold for headings and key metrics, bold only for critical emphasis`
- Data display guidance: `use tabular numbers for metrics and tables, truncate long identifiers carefully, keep helper text one step smaller/lighter than body text, and avoid oversized type on operational screens`

## Extended Guidance

For detailed visual constraints, load `docs/design-extended.md`:
- Shape, spacing, radius, and shadow scale
- Density tokens, density usage map, and escalation rules
- Component defaults and overlay behavior
- Motion guidance and practical do/don't rules

## Change Policy

- Keep this file concise and product-specific.
- Add only decisions that should influence multiple screens or specs.
- Remove stale guidance when the design system changes.
