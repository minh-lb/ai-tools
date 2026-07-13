# CC Team SP

Skill boot một superpowers-native agent team gồm Planner, Leader và Coder. Planner phân tích task và tạo spec+plan, Leader điều phối execution, Coder implement qua Codex với verification. Team chạy đến khi hoàn thành và báo cáo — user review và commit thủ công.

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
| **Planner** | Claude agent | `brainstorming` → `writing-plans` | Hỏi/duyệt trực tiếp với user, spec, plan | Phase 1 only |
| **Leader** | Claude agent | `executing-plans` | Điều phối execution, không code | Từ Phase 2 (nhận plan) |
| **Coder** | Claude agent | `codex:codex-rescue` + `verification` | Implement + verify | Mỗi slice |
| **Reviewer** | Codex on-demand | `codex:review` / `codex:adversarial-review` | Review code | Khi multi-file/high-risk |
| **Claude Reviewer** | Claude subagent | `requesting-code-review` | Deep review | Chỉ khi Block+high-risk |

---

## Workflow

```
Phase 1 — Boot
/team-sp → tạo Leader + Planner + Coder
    ↓
"CC Team SP booted. Provide your task."

Phase 2 — Planning  [Planner active, hỏi thẳng user qua main — Leader chưa tham gia]
User cung cấp task → Planner (trực tiếp, không qua Leader)
    ↓
Planner: brainstorming (tối đa 3 Q&A, hỏi thẳng user)
    ↓ ⛔ user approves design (trực tiếp với Planner)
Planner: writing-plans
    ↓ ⛔ user approves plan (trực tiếp với Planner)
Planner gửi 1 message duy nhất cho Leader: "Phase 1 complete. Plan approved by user." → Planner im lặng

Phase 3 — Execution  [Leader + Coder]
    ↓
Leader loop mỗi slice:
  → Coder: codex:codex-rescue (retry 1 lần nếu fail, fallback Edit/Write/Bash)
  → Coder: inline verification checklist
  → Leader inspect diff + verify checklist

Phase 4 — Review  [on-demand]
  → (nếu multi-file/high-risk) Coder: codex:review
  → (nếu Block+high-risk) Claude Reviewer subagent
    ↓
Leader final diff review → report → TASK COMPLETE. (user commits manually)
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
→ CC Team SP booted. Provide your task to begin.

Thêm JWT authentication vào API. Dùng access token 15 phút + refresh token 7 ngày.
Xem spec tại docs/auth-spec.md.
```

### Bug fix phức tạp

```text
/team-sp
→ CC Team SP booted. Provide your task to begin.

Fix race condition trong StockService::deduct() — inventory đang về âm khi flash sale.
```

### Refactor đa file

```text
/team-sp
→ CC Team SP booted. Provide your task to begin.

Refactor module thanh toán để tách PaymentService thành PaymentGateway + PaymentProcessor.
Giữ nguyên interface hiện tại, không breaking change.
```

### Migration

```text
/team-sp
→ CC Team SP booted. Provide your task to begin.

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
└── agents/
    ├── planner.md         # System prompt cho Planner agent
    ├── leader.md          # System prompt cho Leader agent
    ├── coder.md           # System prompt cho Coder agent
    └── reviewer.md        # Codex review lane contracts
```
