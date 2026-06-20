# CC Team Full

Skill boot một full multi-agent team với workflow TDD đầy đủ. Phù hợp cho feature phức tạp cần spec rõ ràng, test coverage toàn diện và code review kỹ lưỡng trước khi merge.

---

## Cách invoke

```text
/cc-team-full
```

Boot team trước, task gửi sau:

```text
/cc-team-full
→ CC Team Full booted. Provide your task to begin.

Implement tính năng đặt hàng với giỏ hàng, áp dụng mã giảm giá và thanh toán.
```

---

## Team

| Agent | Tạo bằng | Model | Vai trò |
|---|---|---|---|
| **Leader** | `TeamCreate` (Claude agent) | `claude-sonnet-4-6` | Orchestrate toàn bộ, viết spec, review testcase, đóng task |
| **Tester** | `TeamCreate` (Claude agent) | `sonnet` → `haiku` (step 2–3) | Viết testcase + unit test + integration test |
| **Coder** | Codex (`/codex:rescue`) | Codex tự quản lý | Implement feature code theo từng slice |
| **Reviewer** | Codex (`/codex:review` hoặc `/codex:adversarial-review`) | Codex tự quản lý | Review code — có thể chạy linter, security scanner, git diff |

---

## Workflow chi tiết

### Boot

```
User gõ /cc-team-full
        │
        ▼
TeamCreate tạo 2 agent: Leader + Tester
(Coder và Reviewer là Codex — on-demand)
        │
        ▼
"CC Team Full booted. Provide your task to begin."
        │
        ▼
    [Chờ task từ user]
```

---

### Phase 1 — Analysis & Spec

```
User gửi task
        │
        ▼
Leader đọc source of truth
(spec, ticket, Notion, hoặc tự explore codebase bằng Read/Grep/Bash)
        │
        ▼
Leader phân tích và thiết kế:
  ├─ User stories & acceptance criteria
  ├─ System architecture impact
  ├─ Database schema (tables, columns, indexes, constraints)
  ├─ API contracts (endpoints, request/response, error codes)
  ├─ Business rules & edge cases
  └─ Out of scope — liệt kê rõ
        │
        ▼
Leader viết → docs/features/<feature-name>/spec.md
        │
        ▼
    ┌──────────────────────────────────────────┐
    │  USER APPROVAL GATE                      │
    │  Leader trình spec cho user              │
    │  Approve → Phase 2                       │
    │  Reject  → Leader hỏi feedback, revise  │
    │            Max 2 revision rounds         │
    │            Vẫn không approve → Escalate │
    └──────────────────────────────────────────┘
```

---

### Phase 2 — Test Design

```
Leader approve spec
        │
        ▼
Leader → SendMessage → Tester
(gửi spec, yêu cầu viết testcase.md)
        │
        ▼
Tester viết docs/features/<feature-name>/testcase.md
Phải cover đủ 6 categories:
  ├─ Happy Path     — primary flows thành công
  ├─ Edge Cases     — boundary, empty, max/min, optional fields
  ├─ Error Paths    — invalid input, missing data, constraint violations
  ├─ Security       — IDOR, SQL injection, XSS, 401/403, PII leak, rate limit
  ├─ Performance    — response time, N+1 query, concurrent, large payload
  └─ Business Rules — positive + negative cho mỗi rule
        │
        ▼
Tester → Leader: trả testcase.md
        │
        ▼
Leader review testcase:
  ✓ Đủ 6 categories?
  ✓ Minimum coverage checklist passed?
  ✓ Align với spec?
        │
   ┌────┴────┐
   │ Có gap? │
   └────┬────┘
   Yes  │  No
        │   └──────────────────────────────────┐
        ▼                                      ▼
Leader → Tester: bổ sung           Leader → Tester: viết actual tests
(max 2 vòng review)
                                              │
                                              ▼
                                   Tester viết Unit Tests:
                                     ├─ Test từng business rule độc lập
                                     ├─ Mock external API, queue, email
                                     └─ KHÔNG mock database
                                              │
                                              ▼
                                   Tester viết Integration Tests:
                                     ├─ Dùng real test database
                                     ├─ Chạy migration trước suite
                                     ├─ Seed data tối thiểu per test
                                     ├─ Truncate/rollback sau mỗi test
                                     ├─ Assert cả DB state, không chỉ response
                                     └─ Cover security TC-3x và performance TC-4x
                                              │
                                              ▼
                                   Tests phải ở trạng thái RED
                                   (fail vì chưa có implementation)
                                              │
                                              ▼
                                   Tester → Leader: báo cáo
```

---

### Phase 3 — Implementation

```
Leader nhận tests từ Tester
        │
        ▼
Leader đọc references/coder.md
        │
        ▼
Leader chia implementation thành bounded slices
(theo layer hoặc feature area)
        │
        ▼
┌──────────────────────────────────────────┐
│  Với mỗi slice:                          │
│                                          │
│  Leader → /codex:rescue                  │
│    (objective, scope, test files, spec)  │
│          │                               │
│          ▼                               │
│  Codex implement code                    │
│          │                               │
│          ▼                               │
│  Leader inspect diff (git diff / Read)   │
│          │                               │
│     ┌────┴────┐                          │
│     │ OK?     │                          │
│     └────┬────┘                          │
│     Yes  │  No → repair slice (max 2x)   │
│          ▼                               │
│  Tiếp slice tiếp theo                    │
└──────────────────────────────────────────┘
        │
        ▼
Không sửa test để pass — chỉ sửa code
```

---

### Phase 4 — Verification

```
Tất cả slices implement xong
        │
        ▼
Leader chạy toàn bộ test suite
        │
   ┌────┴─────┐
   │ All pass?│
   └────┬─────┘
   Yes  │  No
        │   └─────────────────────────────┐
        ▼                                 ▼
  Tiếp Phase 5              Leader → /codex:rescue repair
                            (chỉ failing tests, không đụng passing)
                                          │
                                     Max 2 cycles
                                          │
                                   Vẫn fail? → Escalate user
```

---

### Phase 5 — Code Review

```
All tests pass
        │
        ▼
Leader đọc references/reviewer.md
        │
        ▼
Leader chọn review lane theo risk:
  ├─ Low / Medium  → /codex:review
  ├─ High          → /codex:adversarial-review
  └─ Blast radius lớn → chạy cả hai
        │
        ▼
Codex review (có thể chạy linter, security scanner, git diff):
  ├─ Architecture — đúng layering, không circular dependency
  ├─ Security     — input validation, parameterized query, auth, no secrets hardcoded
  ├─ Code Quality — function size, error handling, naming, no dead code
  └─ Database     — migration reversible, index đúng, no N+1
        │
        ▼
Verdict:
  ├─ Approve              → Leader final diff review → Close task
  ├─ Approve with concerns → Document concerns → Close task
  ├─ Revise               → Leader tạo repair slice → Re-test → Re-review
  └─ Block                → Leader tạo repair slice → Re-test → Re-review
```

---

### Final Report

```
Leader báo cáo cho user:
  ├─ Feature name + spec location
  ├─ Những gì đã implement vs out of scope
  ├─ Test results: unit X/X passed, integration Y/Y passed
  ├─ Review verdict + concerns nếu có
  └─ Files changed
```

---

## Artifacts

| File | Ai tạo | Nội dung |
|---|---|---|
| `docs/features/<name>/spec.md` | Leader | System design, DB schema, API contracts, business rules |
| `docs/features/<name>/testcase.md` | Tester | Test cases theo 6 categories với TC-ID |
| Unit test files | Tester | Business logic tests, isolated |
| Integration test files | Tester | Full flow tests với real test database |

---

## Gates — điểm dừng

| Gate | Ai quyết | Điều kiện tiếp |
|---|---|---|
| Sau Phase 1 | **User** | Approve spec.md |
| Sau Phase 2 | **Leader** | Testcase đủ 6 categories, tests ở RED state |
| Sau Phase 4 | **Leader** | All tests pass |
| Sau Phase 5 | **Reviewer** | Approve hoặc Approve with concerns |

---

## Stop conditions — team dừng và hỏi user

- Spec quá mơ hồ sau 2 lần làm rõ
- Tests không thể viết vì conflict trong design
- Implementation không thể pass tests mà không thay đổi spec
- Security issue nghiêm trọng không có fix an toàn trong scope
- Command surface không available, không có fallback

---

## Model selection — tối ưu chi phí

| Agent | Phase | Model | Lý do |
|---|---|---|---|
| **Leader** | Toàn bộ | `claude-sonnet-4-6` | Orchestration, system design, decision — Sonnet đủ mạnh |
| **Tester** | Toàn bộ | `claude-sonnet-4-6` | TeamCreate agent — model cố định. Steps 2–3 dùng terse instruction để giảm output tokens |
| **Coder** | Implement | Codex tự quản lý | Không control từ skill |
| **Reviewer** | Low / Medium | Codex (`/codex:review`) | Chạy được linter, security scanner, git diff trực tiếp |
| **Reviewer** | High risk | Codex (`/codex:adversarial-review`) | Codex actively tries to break the implementation |

**Tại sao Reviewer dùng Codex thay Claude agent:**
Codex reviewer có thể chạy tool thật (linter, static analysis, security scanner, `git diff`) — Claude agent chỉ đọc code bằng mắt. `/codex:adversarial-review` đã cover phần security-critical mà trước đây cần Opus.

---

## So sánh với các skill khác

| | Claude trực tiếp | `agent-team` | `cc-team-mini` | `cc-team-full` |
|---|---|---|---|---|
| Spec document | ✗ | ✗ | ✗ | ✅ |
| Test cases | ✗ | ✗ | ✗ | ✅ |
| TDD workflow | ✗ | ✗ | ✗ | ✅ |
| Security test | ✗ | ✗ | ✗ | ✅ |
| Performance test | ✗ | ✗ | ✗ | ✅ |
| Code review | ✗ | ✅ | ✅ | ✅ |
| Autonomous | ✗ | ✗ | ✅ | ✅ |

---

## Cấu trúc file

```
cc-team-full/
├── SKILL.md                  # Boot sequence, phases, stop conditions
├── README.md                 # File này
├── agents/
│   └── openai.yaml           # Interface definition
└── references/
    ├── leader.md             # Orchestration guide — 5-phase workflow
    ├── tester.md             # Testcase + test implementation guide (6 categories)
    ├── coder.md              # Codex implementation guide
    └── reviewer.md           # Code review — architecture, security, quality
```
