# CC Team

Skill boot một agent team gồm Claude Code (Leader) và Codex (Worker). Một lần gọi — team tự chạy toàn bộ workflow đến khi xong, không cần can thiệp thủ công từng bước.

---

## Cách invoke

```text
/team-sp
```

Boot team trước. Sau khi team báo sẵn sàng, mới cung cấp task:

```text
/team-sp
→ CC Team booted. Provide your task to begin.

Thêm JWT authentication vào API. Dùng access token 15 phút + refresh token 7 ngày.
```

---

## Team được tạo ra gồm gì

| Agent | Tạo bằng | Vai trò | Khi nào |
|---|---|---|---|
| **Leader** | `TeamCreate` (Claude agent) | Đọc spec, plan, chia slice, review diff | Luôn luôn — tạo khi boot |
| **Reviewer** | `TeamCreate` (Claude agent) | Review độc lập, đánh giá kết quả Codex | Chỉ khi risk Medium/High — tạo khi nhận task |
| **Coder** | Codex (`/codex:rescue`) | Implement, fix bug, chạy validation | On-demand — Leader invoke mỗi slice |
| **Review lanes** | Codex (`/codex:review`, `/codex:adversarial-review`) | Review code tự động | On-demand — Leader invoke khi điều kiện thỏa |

---

## Workflow

```
Phase 1 — Boot
/team-sp
    ↓
TeamCreate → Leader agent
    ↓
"CC Team booted. Provide your task."
    ↓
[chờ user cung cấp task]

Phase 2 — Execute (sau khi user gửi task)
    ↓
Leader classify risk → tạo Reviewer nếu Medium/High
    ↓
Kickoff gate: trình plan cho user
  (High risk → chờ approval; Low/Medium → tự chạy)
    ↓
Loop mỗi slice — tự động, không dừng hỏi:
  → /codex:rescue → inspect diff → verify checklist
  → nếu fail: retry 1 lần → nếu fail tiếp: escalate user
  → nếu cần review: /codex:review hoặc /codex:adversarial-review
    ↓
Final diff review bởi Leader
    ↓
Report kết quả cho user
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
