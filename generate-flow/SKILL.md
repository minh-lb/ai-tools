---
name: generate-flow
description: Use when tracing a feature's data and logic end-to-end through source code layers - from trigger to persistence, event emission, response, or failure. Triggers on "generate flow", "trace data flow", "document flow", or "how does X work" over a specific feature.
argument-hint: <feature-name | file-path | component-name>
---

# Generate Flow

Trace `$ARGUMENTS` end-to-end and write one grounded document at `docs/flow/<feature-name>.md`.

The goal is practical documentation, not exhaustive reverse-engineering:
- show the executed path from trigger to terminal
- record only code-backed decisions and mutations
- stop when the behavior is sufficiently documented for another engineer to maintain or test it

If `$ARGUMENTS` is empty, print this and stop:

```text
Usage: /generate-flow <feature-name | file-path | component-name>
Example: /generate-flow checkout
Example: /generate-flow src/orders/checkout.service.ts
```

If `$ARGUMENTS` is ambiguous, ask one targeted question. Never invent behavior.

## Use / Skip

Use this skill for:
- end-to-end feature tracing
- onboarding docs for an existing flow
- understanding where data is validated, transformed, persisted, emitted, or returned
- preparing test design from real decision branches and terminals

Skip this skill for:
- defect investigation without documentation output -> use `debugger`
- implementing or fixing behavior
- architecture design across services whose source is not in this directory tree

## Execution Strategy

### 1. Scope the feature first

Resolve the smallest clear unit to document:
- If given a file path, start there and derive the feature name from the filename stem after stripping common suffixes like `.service`, `.controller`, `.handler`, `.repository`, `.gateway`, `.worker`.
- If given a plain feature name, search exact matches first, then route/controller/handler registrations, then service/use-case files, then UI/state entry points.
- If the same feature name maps to more than 3 materially different entry points, stop and ask the user to narrow scope.

Derive `feature-name` as kebab-case.

### 2. Resolve entry points

Find the actual trigger before tracing internals.

Preferred search order:
1. exact file or symbol match
2. route, controller, handler, consumer, worker, or command registration
3. direct callers of the suspected service or component
4. tests only when they reveal the real entry or payload shape

Supported trigger classes:
- HTTP endpoint
- event or queue consumer
- scheduled job
- CLI command
- UI page or form submit
- store action
- internal service entry

If multiple valid triggers exist, document each as a separate `Path`, but only when they execute meaningfully different logic.

### 3. Trace only the executed path

Starting from each entry point, follow the call chain depth-first until a terminal is reached.

**Data notation standard** — use this format in all annotation blocks and arrow labels:

```
fieldName: Type               // required
fieldName?: Type              // optional (may be absent)
fieldName: Type | null        // required but nullable
fieldName?: Type | null       // optional and nullable
status: "a" | "b" | "c"      // enum — list all values
amount: number                // required; constraint as inline comment: > 0, maxLength: 20, format: uuid|email|date, etc.
```

Look for type information in: DTO classes, TypeScript interfaces, Zod/Joi/Pydantic schemas, Go structs, proto definitions, DB column definitions. Mark anything not found in code as `(inferred)`.

For each traversed layer, extract what feeds the output:
- **sequenceDiagram arrows**: the data shape at each handoff (abbreviated to `[An]` when complex)
- **`Note over`**: the key action inside the layer — validate, transform, persist, emit
- **`Chú thích dữ liệu [An]`**: full data shape + per-field change status (unchanged / derived from / removed / newly created)
- **`## Điểm kết thúc`**: every DB write, event publish, external call, response, or error reached
- **`## Câu hỏi còn mở`**: unresolved boundaries, inferred shapes, or cut-off points

Evidence priority: (1) exact code path → (2) type/schema/DTO definitions → (3) tests or fixtures → (4) inference from usage. Record `file:line` for key decisions and mutations wherever possible.

**Internal vs external service boundary** — classify every downstream call before tracing it:

- **Internal**: the call target resolves to a handler file inside the current working directory tree. Continue tracing into that handler as a new participant. Mark it with `Note over <Service>: (internal service)`.
- **External**: third-party API, managed platform (Stripe, SendGrid, AWS SQS), or any service whose source is not in this directory. Stop here — record the boundary, add `Note over <Service>: (TERMINAL - external)`, do not trace further.

To classify: find the base URL or topic config of the HTTP client / message publisher. If it resolves via an env var (e.g. `INVENTORY_SERVICE_URL`) to a service directory that exists locally, search for the matching route handler — found → internal, otherwise → external. For message consumers: if the consuming service source exists locally, document its handler as a separate `### Path:` with its own trigger.

Trace rules:
- Follow callees, not unrelated callers.
- Follow fan-out branches only when they change the outcome, mutate data, or create a side effect.
- Treat helper functions as part of the same layer unless they introduce a new boundary or meaningful decision.
- For internal service calls: cross the boundary and continue tracing into the target handler as a new participant.
- For external service calls: treat as a terminal. Record the boundary; do not trace beyond it.
- Stop at the first stable terminal for the path: DB write, cache write, external API call, event publish, returned response, or thrown error.

Stop tracing when any of these is true:
- terminal reached
- depth exceeds 6 layers from the current service's entry point (reset the counter when crossing into a new internal service)
- next step enters third-party or standard-library code
- next step is an external service call (not resolvable within this directory tree)

If the real flow goes deeper, note the cutoff in `## Câu hỏi còn mở`.

### 4. Generate `docs/flow/<feature-name>.md`

Read `generate-flow/templates/flow.template.md` as the output skeleton if the file is accessible (it may not be when the skill is installed outside the `ai-tools` repo). If it cannot be found, rely on the rendering rules and table headers below instead. When you need a full finished example, read `generate-flow/references/example-checkout-flow.md` (monolith / HTTP) or `generate-flow/references/example-order-fulfillment-flow.md` (microservice / event-driven) — pick the one that best matches the project under trace. Do not read either by default.

**Output root rule:** Always write to `docs/flow/` relative to the **project working directory root** (the top-level directory of the repo, not the directory of the source file being traced). If the source file is inside a subdirectory (e.g. `laravel-app/Modules/...`), the output is still `./docs/flow/<feature-name>.md`, never `laravel-app/docs/flow/<feature-name>.md`.

Preflight:
- If `docs/flow/<feature-name>.md` exists, preserve every existing row from `## Lịch sử chỉnh sửa` and append one new row: `Regenerated from code`.
- If it does not exist, create it with one row: `Initial generation`.
- Create `docs/flow/` if needed.

The generated file must contain these sections in order:
1. `Header` — `# Flow: <name>`, `Feature`, `Entry point`
2. `## Lịch sử chỉnh sửa`
3. `## Flow Summary`
4. `## Full Flow`
5. `## Điểm kết thúc`
6. `## Câu hỏi còn mở` — include only when there are unresolved questions

**Language rule:** Write all descriptive content in Vietnamese — feature descriptions, logic steps, side effects, open questions. Keep English for: field names, file paths, function names, layer type labels (API, Service, Repository, Cache, External, Queue, UI, Store, Worker, Domain), HTTP methods, status codes, event names, change types (CREATE / UPDATE / DELETE / DERIVE / RENAME), code blocks, and all Mermaid diagram labels.

Rendering rules:
- `## Flow Summary` must be concise: describe the logic flow in <= 3 sentences with no data detail. Use `flowchart LR` with <= 15 nodes to show only the path through layers. Steps table <= 8 rows, one short step per row.
- If multiple entry points exist, list each on its own line in the `Entry point` field.
- `## Full Flow` contains one `### Path:` section per distinct trigger.
- `sequenceDiagram` represents **both logic flow** (who calls whom, in what order) **and data flow** (what shape data has at each handoff, how it changes between steps) — do not separate these into different sections. Use `autonumber`, one participant per real layer. Arrow labels write data shape as `field: Type, field: Type`; when too long, shorten to `[An]` notation and explain in the Data Annotations section. Use `activate`/`deactivate` to clarify call lifetimes. Use `Note over` to record important actions inside a layer (validate, transform, persist). For non-HTTP triggers, replace `Client` with the actual trigger name (`Scheduler`, `EventConsumer`, CLI command name, etc.).
- `#### Chú thích dữ liệu`: required whenever any arrow label is shortened with `[An]`. Each annotation records the full data shape at that point and explicitly states for every field: **unchanged** from previous step / **derived** from which field / **removed** at this step / **newly created**. Omit this section only when all data shapes are already fully expressed in arrow labels.
- `#### Sơ đồ quyết định` (`flowchart TD`): add only when flow is non-linear. Omit entirely for straight-line flows.
- `## Điểm kết thúc` must include every DB write, event publish, external boundary, response, and error terminal reached in the flow. Add one row per terminal even when multiple share the same type.

Table column headers — use these exact headers in the output:
- **Flow Summary steps table**: `| # | Bước | Mô tả |`
- **Điểm kết thúc**: `| Loại | Mô tả | File | Function |`
- **Lịch sử chỉnh sửa**: `| Ngày | Thay đổi | Bởi |`

## Token Discipline

Keep the skill practical and cheap to run:
- Read the example file (`generate-flow/references/example-checkout-flow.md`) only once — on first use if you are uncertain about the output format. Once the format is clear, do not re-read it.
- Do not paste large schemas or entire DTOs when a compact shape is enough. Prefer compact shapes like `Order { id, total, status }` over full type definitions unless a field-level distinction matters.
- Do not trace tests, mocks, generated files, or migrations unless they are the only reliable source of behavior.
- Avoid repeating the same behavior across `## Flow Summary` and `## Full Flow`. Each section must add value the others don't: Summary = big picture logic path without data detail, Full Flow = interaction and data evolution with exact shapes.
- If one path is the canonical production path and other paths are thin wrappers, document the canonical path fully and mention wrappers in one sentence instead of duplicating the sequence.

## Mermaid Safety

Every Mermaid block must be renderable.

Rules:
- no placeholders such as `{{...}}` or `<...>` in final output
- no curly braces or quotes inside labels
- no nested `:` inside sequence arrow labels
- participant names must be identifier-safe
- split diagrams when a single diagram would exceed about 40 nodes
- use plain rectangle nodes for errors and outputs

## Quality Bar

The output is only acceptable when all of these are true:
- every step is grounded in repo code
- every documented file path exists
- every meaningful branch maps to a real conditional
- every [An] annotation traces each field change to its source layer
- every path reaches a real terminal or explicitly states why it stops
- prior edit history rows are preserved on regeneration
- no template notes, placeholders, or agent instructions remain in the generated file

## Output

After writing the file, print:

```text
Flow generated for: <feature-name>
  File: docs/flow/<feature-name>.md
```

Do not commit files unless the user explicitly asks.
