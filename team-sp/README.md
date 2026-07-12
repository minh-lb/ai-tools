# CC Team SP

Skill boot một superpowers-native agent team gồm Planner, Leader và Coder. Planner phân tích task và tạo spec+plan, Leader điều phối execution, Coder implement qua Codex với verification. Team tự chạy toàn bộ workflow đến khi xong.

---

## Cách invoke

```text
/team-sp
```

Boot team trước. Sau khi team báo sẵn sàng, mới cung cấp task:

```text
/team-sp
→ CC Team SP booted. Provide your task to begin.

Thêm JWT authentication vào API. Dùng access token 15 phút + refresh token 7 ngày.
```

---

## Team được tạo ra gồm gì

| Agent | Loại | Skill | Vai trò | Khi nào |
|---|---|---|---|---|
| **Planner** | Claude agent | `brainstorming` → `writing-plans` | Explore intent, spec, plan | Phase 1 only |
| **Leader** | Claude agent | `executing-plans` | Relay, điều phối, không code | Suốt workflow |
| **Coder** | Claude agent | `codex:codex-rescue` + `verification` | Implement + verify | Mỗi slice |
| **Reviewer** | Codex on-demand | `codex:review` / `codex:adversarial-review` | Review code | Khi multi-file/high-risk |
| **Claude Reviewer** | Claude subagent | `requesting-code-review` | Deep review | Chỉ khi Block+high-risk |

---

## Workflow

```
Phase 1 — Planning
/team-sp → Boot (Leader + Planner + Coder)
    ↓
User cung cấp task → Leader → Planner
    ↓
Planner: brainstorming (Q&A relay qua Leader)
    ↓ ⛔ user approves design
Planner: writing-plans
    ↓ ⛔ user approves plan
Leader nhận plan

Phase 2 — Execution
    ↓
Leader: executing-plans → loop mỗi slice:
  → Coder: codex:codex-rescue
  → Coder: verification-before-completion
  → Leader inspect diff
  → (nếu multi-file/high-risk) Coder: codex:review
    → (nếu Block+high-risk) Claude Reviewer subagent
    ↓
Leader final diff review → commit → report
```

---

## Khi nào review lane được kích hoạt tự động

**`/codex:review`** — khi:
- thay đổi span nhiều file
- cần independent bug/regression pass
- user yêu cầu review

**`/codex:adversarial-review`** — khi:
- auth, permissions, secrets
- tiền, billing, quotas, destructive actions
- migration, data integrity, rollback
- deployment, external side effects
- cycle trước bất ổn hoặc không khớp spec

---

## Khi nào team dừng và hỏi user

Team **không tự quyết** khi gặp:

- Spec quá mơ hồ để chia slice an toàn
- Thay đổi destructive / irreversible chưa được approve
- Codex không thể validate path nguy hiểm
- Review liên tục thấy vấn đề design, không phải implementation
- Command surface không available và không có fallback an toàn

---

## Ví dụ sử dụng

> Luôn boot trước (`/team-sp`), task gửi sau khi team báo sẵn sàng.

### Feature mới

```text
/team-sp
→ CC Team booted. Provide your task to begin.

Thêm JWT authentication vào API. Dùng access token 15 phút + refresh token 7 ngày.
Xem spec tại docs/auth-spec.md.
```

### Bug fix phức tạp

```text
/team-sp
→ CC Team booted. Provide your task to begin.

Fix race condition trong StockService::deduct() — inventory đang về âm khi flash sale.
```

### Refactor đa file

```text
/team-sp
→ CC Team booted. Provide your task to begin.

Refactor module thanh toán để tách PaymentService thành PaymentGateway + PaymentProcessor.
Giữ nguyên interface hiện tại, không breaking change.
```

### Migration

```text
/team-sp
→ CC Team booted. Provide your task to begin.

Viết và chạy migration thêm soft delete cho bảng invoices.
Đảm bảm backward compatible với các query hiện có.
```

---

## Không dùng skill này khi

- Task đơn giản, một file, chỉ cần Claude làm trực tiếp
- Bạn muốn kiểm soát từng bước thủ công — dùng `agent-team` thay thế
- Codex CLI chưa được cài hoặc `/codex:rescue` không available

---

## Cấu trúc file

```
team-sp/
├── SKILL.md               # Boot sequence và runtime config
├── README.md              # File này
├── agents/
│   └── openai.yaml        # Interface definition
└── references/
    ├── leader.md          # System prompt cho Leader agent
    ├── coder.md           # Codex context — pass vào mỗi /codex:rescue
    └── reviewer.md        # Context cho review lanes
```
