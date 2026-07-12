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
- architecture design across multiple services not present in this repo

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

**Data notation standard** — use this format consistently in all Input/Output blocks, Data Shape Evolution, and Mutation Tables:

```
fieldName: Type               // required
fieldName?: Type              // optional (may be absent)
fieldName: Type | null        // required but nullable
fieldName?: Type | null       // optional and nullable
status: "a" | "b" | "c"      // enum — list all values
amount: number                // required; constraint as inline comment: > 0, maxLength: 20, format: uuid|email|date, etc.
```

Look for type information in: DTO classes, TypeScript interfaces, Zod/Joi/Pydantic schemas, Go structs, proto definitions, DB column definitions. If a constraint cannot be found in code, mark it `(inferred)`.

For each traversed layer, capture:
- `Layer`: API, Service, Repository, Cache, External, Queue, UI, Store, Worker, Domain
- `File`
- `Function / Method`
- `Input data`: full shape using the notation above — every field with type, required/optional, nullable, and key constraints
- `Logic`: key decisions, validations, and transformations applied
- `Output data`: full shape using the notation above
- `Mutations`: for every field that changes, record: field name, type, change type (`CREATE` / `UPDATE` / `DELETE` / `DERIVE` / `RENAME`), value or type before, value or type after, exact `file:line`
- `Side effects`: DB writes, cache invalidations, events emitted, external calls made
- `Evidence`: exact `file:line` for the call, mutation, conditional, or terminal when available

Trace rules:
- Follow callees, not unrelated callers.
- Follow fan-out branches only when they change the outcome, mutate data, or create a side effect.
- Treat helper functions as part of the same layer unless they introduce a new boundary or meaningful decision.
- Treat downstream HTTP calls, published messages, and third-party SDK calls as terminals. Record the boundary; do not trace beyond it.
- Stop at the first stable terminal for the path: DB write, cache write, external API call, event publish, returned response, or thrown error.

Stop tracing when any of these is true:
- terminal reached
- depth exceeds 6 layers from the entry point
- next step enters third-party or standard-library code
- next step crosses into another service not contained in this repo

If the real flow goes deeper, note the cutoff in `Open Questions`.

### 4. Build the flow model

Before writing the document, derive:
1. `Sequence`: caller → callee handoffs with the data shape at each boundary
2. `Decision points`: only conditionals that change behavior or output
3. `Data mutations`: for every field that changes — change type, value before, value after, source location
4. `Data shape evolution`: the full snapshot of the primary domain object at each layer boundary — shows how it is built up, transformed, and finalized from trigger to terminal
5. `Terminals`: writes, emits, responses, and errors
6. `Open questions`: unresolved boundaries, inferred shapes, or missing downstream code

Evidence priority:
1. exact code path
2. nearby type/schema/DTO definitions
3. tests or fixtures
4. inference from usage

Mark inferred details explicitly with `(inferred)`.

### 5. Generate `docs/flow/<feature-name>.md`

Read `generate-flow/templates/flow.template.md` as the output skeleton if the file is accessible (it may not be when the skill is installed outside the `ai-tools` repo). If it cannot be found, rely on the rendering rules and table headers below instead. Read `generate-flow/references/example-checkout-flow.md` only when you need a full finished example; do not read it by default.

Preflight:
- If `docs/flow/<feature-name>.md` exists, preserve every existing row from `Edit History` and append one new row: `Regenerated from code`.
- If it does not exist, create it with one row: `Initial generation`.
- Create `docs/flow/` if needed.

The generated file must contain these sections in order:
1. `Header` — `# Flow: <name>`, `Feature`, `Entry point`, `Generated`, `Author`
2. `## Lịch sử chỉnh sửa`
3. `## Tóm tắt`
4. `## Flow đầy đủ`
5. `## Phân tích từng layer`
6. `## Điểm kết thúc`
7. `## Câu hỏi còn mở` — chỉ thêm khi cần

**Language rule:** Viết toàn bộ nội dung mô tả bằng tiếng Việt — mô tả feature, các bước logic, side effects, open questions. Giữ nguyên tiếng Anh cho: field names, file paths, function names, layer type labels (API, Service, Repository, Cache, External, Queue, UI, Store, Worker, Domain), HTTP methods, status codes, event names, change types (CREATE / UPDATE / DELETE / DERIVE / RENAME), code blocks, và tất cả Mermaid diagram labels.

Rendering rules:
- `## Tóm tắt` phải ngắn gọn: mô tả <= 5 câu, `flowchart LR` <= 20 nodes, bảng các bước chính <= 10 dòng.
- `### Các thay đổi dữ liệu chính`: liệt kê mọi field được tạo hoặc thay đổi có ý nghĩa trong toàn bộ flow. Bỏ section này chỉ khi thực sự không có field nào thay đổi.
- Nếu có nhiều entry point, liệt kê từng cái trên một dòng riêng trong field `Entry point`.
- `## Flow đầy đủ` chứa một section `### Path:` cho mỗi trigger riêng biệt. Mỗi path phải có đủ 3 subsection dưới đây.
- `#### Sơ đồ tuần tự`: dùng `autonumber`, một participant cho mỗi layer thực tế. **Arrow labels phải thể hiện data shape tại mỗi handoff** — field names và types, không chỉ tên function. Với non-HTTP trigger, thay `Client` bằng tên trigger thực tế (`Scheduler`, `EventConsumer`, tên CLI command, v.v.).
- `#### Quá trình biến đổi dữ liệu`: đặt ngay sau Sơ đồ tuần tự. Mỗi dòng là một điểm trong flow nơi hình dạng của object thay đổi — bao gồm mọi field được thêm, xóa, tính lại, đổi tên. Bắt buộc cho flow đi qua 3+ layer hoặc có transformation có ý nghĩa.
- `#### Sơ đồ quyết định` (`flowchart TD`): chỉ các nhánh dẫn đến kết quả thực sự khác nhau. Bỏ hoàn toàn nếu flow tuyến tính.
- `## Phân tích từng layer`: một section `###` cho mỗi layer thực tế trong code. Không giới hạn ở 3. Mỗi section gồm: `**File:**`, `**Function:**`, code block `**Đầu vào:**` (dùng data notation standard — mỗi field một dòng với type + required/optional + constraints), bước logic có số thứ tự `**Logic:**`, code block `**Đầu ra:**` (cùng format), `**Side effects:**`.
- `#### Bảng thay đổi dữ liệu`: xuất hiện cho mọi layer có tạo, cập nhật, xóa, tính toán, hoặc đổi tên field. Bắt buộc khi có — không được bỏ để cho output ngắn hơn. Mỗi dòng phải có **change type** và source location chính xác.
- `## Điểm kết thúc` phải bao gồm mọi DB write, event publish, external boundary, response, và error terminal được reach trong flow. Thêm dòng khi cần — một dòng cho mỗi terminal dù cùng loại.

Table column headers — dùng đúng các header này:
- **Các bước chính**: `| # | Layer | Điều gì xảy ra | Data shape |`
- **Các thay đổi dữ liệu chính**: `| Field | Set by | Layer |`
- **Quá trình biến đổi dữ liệu**: `| Layer | Snapshot dữ liệu |`
- **Bảng thay đổi dữ liệu** (mỗi layer): `| Field | Type | Change | Trước | Sau | Source |` — Change values: `CREATE` / `UPDATE` / `DELETE` / `DERIVE` / `RENAME`; Type là kiểu dữ liệu của field, thêm `?` nếu optional, `| null` nếu nullable
- **Điểm kết thúc**: `| Loại | Mô tả | File | Function |`
- **Lịch sử chỉnh sửa**: `| Ngày | Thay đổi | Bởi |`

### 6. Register in `docs/flow/README.md`

If `docs/flow/README.md` does not exist, create:

```markdown
# Flow Documentation

This directory is maintained by the `generate-flow` skill. Do not edit rows manually.

| Feature | File | Last Updated |
| --- | --- | --- |
```

Then add or update exactly one row for the feature:
- `Feature`: plain text feature name
- `File`: `[view](<feature-name>.md)`
- `Last Updated`: today's date in `YYYY-MM-DD`

Do not create duplicate rows.

## Token Discipline

Keep the skill practical and cheap to run:
- Read the example file (`generate-flow/references/example-checkout-flow.md`) only once — on first use if you are uncertain about the output format. Once the format is clear, do not re-read it.
- Do not paste large schemas or entire DTOs when a compact shape is enough. Prefer compact shapes like `Order { id, total, status }` over full type definitions unless a field-level distinction matters.
- Do not trace tests, mocks, generated files, or migrations unless they are the only reliable source of behavior.
- Avoid repeating the same behavior across `## Tóm tắt`, `## Flow đầy đủ`, and `## Phân tích từng layer`. Each section must add value the others don't: Summary = big picture, Full Flow = interaction and data evolution, Layer Breakdown = per-layer detail.
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
- every mutation row names the layer and source location
- every path reaches a real terminal or explicitly states why it stops
- prior edit history rows are preserved on regeneration
- no template notes, placeholders, or agent instructions remain in the generated file

## Output

After writing the files, print:

```text
Flow generated for: <feature-name>
  File  : docs/flow/<feature-name>.md
  Index : docs/flow/README.md
```

Do not commit files unless the user explicitly asks.
