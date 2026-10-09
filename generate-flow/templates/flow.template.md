# Flow: {{feature-name}}

- **Feature:** {{feature-name}}
- **Entry point:** {{entry-points}}

---

## Lịch sử chỉnh sửa

| Ngày | Thay đổi | Bởi |
| --- | --- | --- |
| {{date}} | Tạo mới | generate-flow |

<!-- Use the actual current date in YYYY-MM-DD format; do not guess. Use Unknown if unavailable. -->

---

## Flow Summary

{{mô tả ngắn gọn logic flow — tối đa 3 câu, không cần nêu chi tiết data}}

```mermaid
flowchart LR
    A([Trigger]) --> B[LayerA]
    B --> C[LayerB]
    C --> D[LayerC]
    D --> E([Terminal])
```

| # | Bước | Mô tả |
| --- | --- | --- |
| 1 | {{bước-1}} | {{mô tả ngắn}} |
| 2 | {{bước-2}} | {{mô tả ngắn}} |
| 3 | {{bước-3}} | {{mô tả ngắn}} |

---

## Full Flow

### Path: {{path-name}}

```mermaid
sequenceDiagram
    autonumber
    participant Trigger
    participant LayerA
    participant LayerB
    participant LayerC

    Trigger->>LayerA: [A1] fieldA=TypeA, fieldB=TypeB
    activate LayerA
    Note over LayerA: validate + transform
    LayerA->>LayerB: [A2] fieldA=TypeA, newField=TypeC
    activate LayerB
    Note over LayerB: persist / call external
    LayerB-->>LayerA: [A3] result=TypeD
    deactivate LayerB
    LayerA-->>Trigger: [A4] status=200, data=TypeD
    deactivate LayerA
```

#### Nguồn code

- `{{repo-relative-path}}` — `{{function-or-symbol}}`: {{hành vi được xác nhận}}

<!-- List source files/functions that support the entry, important handoffs/branches, and terminals. Use only real repo-relative paths and symbols. -->

#### Chú thích dữ liệu

<!-- required whenever any arrow label uses [An] shorthand or field evolution would otherwise be unclear -->

**[A1]** `Trigger` → `LayerA` — raw input:
```
fieldA: TypeA               // required
fieldB?: TypeB              // optional
fieldC: "x" | "y" | "z"    // enum
```

**[A2]** `LayerA` → `LayerB` — sau validate & transform:
```
fieldA: TypeA               // giữ nguyên
newField: TypeC             // derive từ fieldA + fieldB
fieldB: —                   // bị loại bỏ sau validate
```

**[A3]** `LayerB` → `LayerA` — kết quả trả về:
```
result: TypeD               // tạo mới tại LayerB
```

**[A4]** `LayerA` → `Trigger` — response cuối:
```
status: number              // 200 | 400 | 500
data: TypeD                 // từ [A3]
```

#### Sơ đồ quyết định

<!-- OPTIONAL: include only when flow is non-linear -->

```mermaid
flowchart TD
    Start([entry-trigger])
    D1{decision-1}
    D2{decision-2}
    E1[error-1]
    E2[error-2]
    OK[success-action]
    Done([terminal])

    Start --> D1
    D1 --condition-a--> E1
    D1 --condition-b--> D2
    D2 --condition-c--> E2
    D2 --condition-d--> OK
    OK --> Done
```

---

## Điểm kết thúc

| Loại | Mô tả | File | Function |
| --- | --- | --- | --- |
| DB Write | {{mô tả dữ liệu được lưu}} | `{{file-path}}` | `{{function-name}}` |
| External | `{{method-or-event}}` tới `{{service-or-provider}}` | `{{file-path}}` | `{{function-name}}` |
| Trace cutoff | {{target chưa xác định hoặc giới hạn trace}} | `{{file-path}}` | `{{function-name}}` |
| Event | {{tên event}} publish đến `{{topic-or-queue}}` | `{{file-path}}` | `{{function-name}}` |
| Error | `{{error-code-or-name}}` tại `{{boundary}}` | `{{file-path}}` | `{{function-name}}` |
| Response | `{{status-code}}` với `{{response-shape}}` | `{{file-path}}` | `{{function-name}}` |
| Acknowledgment | `{{message-ack}}` | `{{file-path}}` | `{{function-name}}` |
| Completion | {{normal job, command, or UI completion}} | `{{file-path}}` | `{{function-name}}` |

---

## Câu hỏi còn mở

<!-- OPTIONAL: include only when there are unresolved boundaries, inferred shapes, or cut-off points -->

- [ ] {{hành vi chưa xác định}}
