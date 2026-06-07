# Frontend Design Contract (Extended)

Extended visual guidance for user-facing UI work. Load this file only when tasks need detailed density, spacing, component-default, or motion decisions.

## How To Use

- Read `docs/design.md` first for core product-wide defaults.
- Use this file only when the task requires deeper visual decisions not covered by `docs/design.md`.
- If a provided screenshot/Figma/mockup conflicts with this file, the screen-level source wins for that screen.

## Shape And Spacing

- Radius scale:
  - `--radius-control: 8px`
  - `--radius-surface: 12px`
  - `--radius-pill: 999px only when the pattern is intentionally pill-shaped`
- Spacing rhythm:
  - `--space-1: 4`
  - `--space-2: 8`
  - `--space-3: 12`
  - `--space-4: 16`
  - `--space-5: 20`
  - `--space-6: 24`
  - section gap default: `var(--space-5)`
  - form field gap default: `var(--space-3)`
  - inline control gap default: `var(--space-2)`
- Border and shadow style:
  - default border: `1px solid var(--color-border-subtle)`
  - surface shadow: `0 1px 2px rgba(15, 23, 42, 0.06)`
  - overlay shadow: `0 8px 24px rgba(15, 23, 42, 0.12)`
- Density guidance: `compact-to-moderate by default, compact for admin/data pages, slightly roomier for setup and form workflows`

## Density Tokens

- Control heights:
  - `--control-sm: 32px` for dense toolbars, table actions, and compact filters
  - `--control-md: 36px` for standard form controls and primary action zones
  - `--control-lg: 40px` only for roomier forms or customer-facing flows
- Table and list density:
  - `--table-row-sm: 40px` for dense operational tables
  - `--table-row-md: 44px` for standard operational tables
  - `--list-row-md: 44px` for clickable list rows with metadata
- Header sizing:
  - `--page-header-gap: var(--space-4)`
  - `--section-header-gap: var(--space-3)`
  - `--toolbar-gap: var(--space-2)`
- Usage rule: default to the smaller valid token for data-heavy screens; move up one size only when readability or touch ergonomics clearly require it.

## Density Usage Map

- Data table screens:
  - controls: `--control-sm`
  - table rows: `--table-row-sm` by default, `--table-row-md` only when rows carry multi-line metadata or selection affordances
  - typography: `--text-body-sm`
  - spacing: favor `--space-2` to `--space-4`
  - use case: admin indexes, operations dashboards, queue views, audit logs
- Filter-heavy list screens:
  - controls: `--control-sm` for inline filters, `--control-md` for the primary search/input when needed
  - list rows: `--list-row-md`
  - typography: `--text-body-sm`
  - spacing: favor `--space-2` to `--space-4`
  - use case: searchable inventories, CRM lists, moderation queues
- Standard form screens:
  - controls: `--control-md`
  - typography: `--text-body-md` for field content, `--text-label` for labels
  - spacing: favor `--space-3` to `--space-5`
  - use case: settings, create/edit forms, multi-section internal tools
- Dense modal or side-panel flows:
  - controls: `--control-sm` by default, `--control-md` only for the primary confirm field/action
  - typography: `--text-body-sm`
  - spacing: favor `--space-2` to `--space-4`
  - use case: quick edits, status changes, inline review workflows
- Customer-facing or high-guidance flows:
  - controls: `--control-md` by default, `--control-lg` only when the flow benefits from extra breathing room
  - typography: `--text-body-md`
  - spacing: favor `--space-4` to `--space-6`
  - use case: onboarding, account setup, externally visible forms

## Escalation Rules

- Do not move from `sm` to `md` or from `md` to `lg` just for visual comfort.
- Increase one size only when at least one of these is true:
  - text becomes hard to scan at the default density
  - the control is the primary focus of a guided workflow
  - the screen is customer-facing and intentionally less dense
  - touch ergonomics are a real constraint for the target device/context
- If a screen mixes densities, keep the data region compact and enlarge only the focused interaction zone.
- Default assumption: internal operational screens should stay compact unless the design source explicitly says otherwise.

## Component Defaults

- Buttons:
  - height: `var(--control-sm)` by default, `var(--control-md)` for primary emphasis zones
  - one clear primary action per zone
  - secondary actions outlined or neutral
  - ghost actions for low-emphasis controls
  - destructive actions visually explicit
- Inputs and forms:
  - field height: `var(--control-md)` for standard controls
  - top-aligned labels
  - concise helper text
  - inline error messaging
  - explicit required-state communication
- Data display:
  - table-first for operational data
  - row height target: `var(--table-row-sm)` to `var(--table-row-md)`
  - cards only for summaries, dashboards, or naturally grouped objects
- Empty states: `keep them practical and compact with one explanatory sentence and one clear next action`
- Status feedback: `inline validation near fields, inline alerts for local section issues, toast for transient success, banner only for cross-page/system-level states`
- Overlays:
  - dialog for confirmations and focused edits
  - drawer or side panel for supporting workflows that should preserve page context
  - avoid modal stacking

## Motion

- Interaction feel: `minimal and crisp`
- Transition guidance: `short hover/focus transitions, subtle opacity/scale/elevation changes only when they improve feedback; loading motion should imply progress without pulling attention away from the task`
- Avoid: `bouncy motion, large page transitions, parallax, decorative loaders, and repeated animation on dense data surfaces`

## Do / Don't

- Do: `use hierarchy from spacing, label weight, and section structure before adding more color or chrome`
- Do: `keep controls stable in size across idle, loading, error, and success states`
- Do: `favor compact headers, toolbars, filters, and table rows when the screen's main job is to display and act on data`
- Don't: `turn every section into an isolated floating card or mix too many elevation levels on one screen`
- Don't: `use bright accent colors as decoration or create hero/marketing composition inside workflow screens`
- Don't: `inflate paddings, control heights, or heading sizes when it reduces the amount of useful data visible above the fold`

## Change Policy

- Keep this file focused on density, spacing, component-default, and motion details not covered by `docs/design.md`.
- Add guidance only when it is genuinely needed on-demand and would inflate `docs/design.md` for most tasks.
- Remove stale guidance when the design system changes.
