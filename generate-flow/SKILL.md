---
name: generate-flow
description: Use when tracing a feature's data and logic end-to-end through source code layers - from trigger to persistence, event emission, response, or failure. Triggers on "generate flow", "trace data flow", "document flow", or "how does X work" over a specific feature.
metadata:
  author: Minh Luu
argument-hint: <feature-name | file-path | component-name>
---

# Generate Flow

Trace `$ARGUMENTS` end-to-end and write one grounded document to `docs/flow/<feature-name>.md`.

The goal is practical documentation, not exhaustive reverse-engineering:
- show the executed path from trigger to terminal
- capture only code-backed decisions, transformations, and side effects
- stop when another engineer can maintain or test the feature without re-tracing the code

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

### 1. Scope the feature

Resolve the smallest clear unit to document:
- If given a file path, start there and derive the feature name from the filename stem after stripping common suffixes like `.service`, `.controller`, `.handler`, `.repository`, `.gateway`, `.worker`.
- If given a plain feature name, search exact matches first, then route/controller/handler registrations, then service/use-case files, then UI/state entry points.
- If the same feature name maps to more than 3 materially different entry points, stop and ask the user to narrow scope.

Derive `feature-name` as kebab-case.

### 2. Resolve real entry points

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

If multiple valid triggers exist, document each as a separate `Path` only when they execute materially different logic.

### 3. Trace only the executed path

Starting from each entry point, follow the call chain depth-first until a terminal is reached.

Evidence priority:
1. exact code path
2. type/schema/DTO definitions
3. tests or fixtures
4. inference from usage

Read the minimum sources needed, in this order:
1. exact target file or registration
2. direct callees on the active path
3. DTO/schema/type definitions for touched payloads
4. tests only if they are the only reliable source of the entry or payload shape

#### Data notation standard

Use typed field notation only inside code blocks under `Chú thích dữ liệu`:

```text
fieldName: Type               // required
fieldName?: Type              // optional
fieldName: Type | null        // required but nullable
fieldName?: Type | null       // optional and nullable
status: "a" | "b" | "c"      // enum
amount: number                // constraints inline when relevant
```

For Mermaid arrow labels, use compact render-safe syntax such as:

```text
[A1] cartId=string, discountCode?, userId=string
[A2] amount=number, currency=string, status=success
```

Do not put quotes, enum unions, nullable unions, or `field: type` pairs inside Mermaid labels — move type detail to `Chú thích dữ liệu`. Colons in URL paths like `/users/:id` are fine.

Record only fields that satisfy at least one condition:
- they drive a branch or guard
- they are created, removed, renamed, or derived
- they are persisted, emitted, returned, or sent externally
- they are required to understand a terminal

For large payloads, collapse unchanged pass-through data into one compact item such as `otherFields: unchanged` in the annotation instead of listing every field.

If a type or behavior is not found in code, mark it as `(inferred)`.

For each traversed layer, capture:
- **sequenceDiagram arrows**: the handoff payload in compact Mermaid-safe form; shorten to `[An]` when complex
- **`Note over`**: the key action inside the layer — validate, transform, persist, emit
- **`#### Chú thích dữ liệu`**: full typed shape only for fields that changed, affect decisions, or matter to a terminal
- **`## Điểm kết thúc`**: every DB write, cache write, event publish, external boundary, response, and real error terminal reached
- **`## Câu hỏi còn mở`**: unresolved boundaries, inferred shapes, or cut-off points

#### Internal vs external boundary

Classify every downstream call before tracing it:
- **Internal**: the target handler/source exists inside the current working directory tree. Continue tracing into it as a new participant and add `Note over <Service>: (internal service)`.
- **External**: third-party API, managed platform, or any service whose source cannot be found locally. Stop tracing past that boundary, add `Note over <Service>: (external boundary - stop tracing here)`, and record the boundary in `## Điểm kết thúc`.

To classify a call, resolve the base URL, topic, or client target from config/env if possible, then search for a matching handler or service directory in the repo. If the target still cannot be resolved, treat it as external and note the uncertainty in `## Câu hỏi còn mở`.

Trace rules:
- Follow callees, not unrelated callers.
- Follow fan-out branches only when they change the outcome, mutate data, or create a side effect.
- Treat helper functions as part of the same layer unless they introduce a new boundary or meaningful decision.
- For external calls, do not trace into the remote service internals. Resume tracing in the current service only if local code continues after the call returns.
- Stop a branch when it reaches a stable terminal: DB write, cache write, event publish with no further in-scope logic, returned response, thrown error, or a trace cut-off boundary that cannot be crossed.
- Reset the depth counter when crossing into a confirmed internal service boundary.

Stop tracing when any of these is true:
- terminal reached
- depth exceeds 6 layers from the current service entry point
- next step enters third-party or standard-library code
- next step crosses an external boundary whose internals are outside the repo

If the real flow goes deeper, note the cutoff in `## Câu hỏi còn mở`.

### 4. Generate `docs/flow/<feature-name>.md`

Read `generate-flow/templates/flow.template.md` as the output skeleton if it is accessible. If it cannot be found, rely on the structure and rendering rules below.

Read a reference example only when the output format is still unclear after reading the template:
- `generate-flow/references/example-checkout-flow.md` for monolith / HTTP flows
- `generate-flow/references/example-order-fulfillment-flow.md` for event-driven / multi-service flows

Never read both examples by default.

**Output root rule:** Always write to `docs/flow/` relative to the project working directory root, never relative to the source subdirectory being traced.

Preflight:
- If `docs/flow/<feature-name>.md` exists, preserve every existing row from `## Lịch sử chỉnh sửa` and append one new row: `Tái tạo từ code`.
- If it does not exist, create it with one row: `Tạo mới`.
- Create `docs/flow/` if needed.

The generated file must contain these sections in order:
1. `Header` — `# Flow: <name>`, `Feature`, `Entry point`
2. `## Lịch sử chỉnh sửa`
3. `## Flow Summary`
4. `## Full Flow`
5. `## Điểm kết thúc`
6. `## Câu hỏi còn mở` — include only when there are unresolved questions

**Language rule:** Write all descriptive content in Vietnamese. Keep English for field names, file paths, function names, layer labels (`API`, `Service`, `Repository`, `Cache`, `External`, `Queue`, `UI`, `Store`, `Worker`, `Domain`), HTTP methods, status codes, event names, change types (`CREATE`, `UPDATE`, `DELETE`, `DERIVE`, `RENAME`), code blocks, and Mermaid labels.

Rendering rules:
- `## Flow Summary` must stay concise: <= 3 sentences, `flowchart LR` with <= 15 nodes, steps table <= 8 rows.
- If multiple entry points exist, list each on its own line in the `Entry point` field.
- `## Full Flow` contains one `### Path:` section per distinct trigger.
- `sequenceDiagram` represents both logic flow and data flow. Use `autonumber`, one participant per real layer, and `activate` / `deactivate` where lifetimes are not obvious.
- Mermaid arrow labels must be render-safe and compact. Use `field=Type`, `status=200`, `ack`, `error`, or a short alias like `[A3] paymentPayload`. Put full typed detail in the annotation section instead of the label.
- `#### Chú thích dữ liệu` is required whenever an arrow label uses `[An]` shorthand or when field evolution would otherwise be unclear. For each listed field, state one of: unchanged / derived from / removed / newly created. For large payloads, describe only changed or decision-relevant fields and add one compact line for untouched pass-through data.
- `#### Sơ đồ quyết định` (`flowchart TD`) is optional. Add it only when the path is non-linear.
- `## Điểm kết thúc` must include one row per terminal or trace cut-off boundary, even when several rows share the same type.

Use these exact table headers:
- `| Ngày | Thay đổi | Bởi |`
- `| # | Bước | Mô tả |`
- `| Loại | Mô tả | File | Function |`

## Token Discipline

Keep the skill practical and cheap to run:
- Read at most one example file, once, and only when the template plus rules are not enough.
- Do not paste large schemas or entire DTOs when a compact field list is enough.
- Prefer compact collection notation such as `items[]`, `errors[]`, `metadata...` over full nested expansions unless a nested field changes behavior.
- Do not trace tests, mocks, generated files, or migrations unless they are the only reliable source of behavior.
- Do not repeat the same behavior across `## Flow Summary`, `## Full Flow`, and `## Điểm kết thúc`.
- If one path is the canonical production path and other paths are thin wrappers, document the canonical path fully and mention wrappers once.
- Stop reading when additional files no longer change the traced path, a decision branch, or a terminal.

## Mermaid Safety

Every Mermaid block must be renderable.

Rules:
- no placeholders such as `{{...}}` or `<...>` in final output
- no quotes or enum unions inside Mermaid labels
- no `field: type` pairs inside Mermaid labels — move type detail to `Chú thích dữ liệu` (colons in URL paths like `/users/:id` are fine)
- participant names must be identifier-safe
- split diagrams when one block would exceed about 40 nodes
- use plain rectangle nodes for errors and outputs

## Quality Bar

The output is acceptable only when all of these are true:
- every step is grounded in repo code
- every documented file path exists
- every meaningful branch maps to a real conditional
- every annotation explains the changed or decision-relevant fields it introduces
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
