# make-task

Skill dùng được cho cả Claude Code và Codex để chuyển một task từ Jira, Trello, Notion, Linear, GitHub Issues hoặc mô tả thủ công thành file tài liệu có cấu trúc, sẵn sàng để AI agent implement trực tiếp mà không cần hỏi lại.

## Cách dùng

> **Prefix:** `/make-task` trong Claude Code · `$make-task` trong Codex.

Ví dụ bên dưới dùng cú pháp Claude Code; khi chạy trong Codex, thay `/make-task` bằng `$make-task`.

```
/make-task <URL hoặc mô tả>          # Tạo task mới
/make-task <ID> --status "<status>"  # Cập nhật trạng thái
```

### Tạo task mới

```
/make-task https://linear.app/team/ENG-42
/make-task https://github.com/owner/repo/issues/88
/make-task https://yourorg.atlassian.net/browse/PROJ-123
/make-task Thêm tính năng đăng nhập bằng Google OAuth
```

Skill sẽ tự động:
1. Fetch nội dung task từ nguồn (Jira MCP, GitHub CLI, web fetch/browse, ...)
2. Tạo `docs/tasks/<ID>.md` với source snapshot gọn và implementation plan đầy đủ
3. Đăng ký task vào `docs/task-overview.md`

> Nếu task ID đã tồn tại, skill sẽ hỏi xác nhận trước khi ghi đè.

### Cập nhật trạng thái

```
/make-task ENG-42 --status "In Progress"
/make-task PROJ-123 --status Done
/make-task TASK-20260708-001 --status Blocked
```

Quotes xung quanh status là tùy chọn. Skill cập nhật đồng thời `docs/tasks/<ID>.md` và `docs/task-overview.md`.

## Trạng thái hợp lệ

| Status | Ý nghĩa |
| --- | --- |
| `Todo` | Đã tạo, chưa bắt đầu |
| `In Progress` | Đang thực hiện |
| `In Review` | Đang review code |
| `Testing` | Đang kiểm thử |
| `Done` | Hoàn thành |
| `Blocked` | Đang bị chặn bởi dependency |
| `Cancelled` | Đã huỷ |

## Output

### `docs/tasks/<ID>.md`

Mỗi file task gồm hai phần:

**Part 1 — Source Snapshot**
Tóm tắt súc tích nhưng giữ nguyên ý nghĩa của ticket: summary, acceptance criteria, constraints, dependency, link và chỉ quote nguyên văn khi thật sự cần để tránh lãng phí token.

**Part 2 — Implementation Plan**
Plan được AI điền từ codebase và mô tả task, gồm:

- **Tag** — phân loại task: `feature`, `bug`, hoặc `hotfix`
- **Goal** — định nghĩa "done" một câu
- **Worktree Setup** — path và branch name cho git worktree
- **Tech Stack & Context** — ngôn ngữ, framework, database, prerequisite
- **Constraints & Out of Scope** — giới hạn cứng, phạm vi không làm
- **Chosen Approach** — hướng triển khai đã chọn và lý do
- **Data Models & Contracts** — schema, API shape (nếu có)
- **Affected Files** — danh sách file cần đọc / tạo / sửa theo thứ tự dependency
- **Task Breakdown** — các bước implement cụ thể
- **Test Strategy** — loại test, nội dung cần cover, đường dẫn file
- **Acceptance Criteria** — điều kiện tự kiểm tra trước khi khai báo done
- **Risks and Mitigations** — rủi ro không hiển nhiên (nếu có)

### `docs/task-overview.md`

Registry tổng hợp tất cả task với ID, title, status, ngày cập nhật và link đến file chi tiết.

## Nguồn task được hỗ trợ

| Nguồn | Phát hiện | Cách fetch |
| --- | --- | --- |
| Jira | `atlassian.net` | Atlassian connector/MCP hoặc paste thủ công |
| Trello | `trello.com` | Trello connector/MCP hoặc Trello API, nếu thiếu auth thì paste thủ công |
| Notion | `notion.so`, `notion.site` | Notion connector/MCP hoặc paste thủ công |
| Linear | `linear.app` | Linear connector/MCP hoặc paste thủ công |
| GitHub Issues | `github.com/.../issues/` | GitHub connector/MCP hoặc `gh issue view` CLI |
| URL khác | bất kỳ | Web fetch/browse |
| Plain text | không có URL | Dùng trực tiếp |

## Implementing agent

File `docs/tasks/<ID>.md` được thiết kế để AI agent khác đọc và implement trực tiếp. Đầu Part 2 có hướng dẫn theo thứ tự:

0. **Tạo git worktree trước** tại `./worktrees/<ID>`, branch `<tag>/<ID>/<short-description>` — base branch được detect tự động từ repo. Dùng helper worktree của harness nếu có; nếu không thì chạy `git worktree add ./worktrees/<ID> -b <tag>/<ID>/<short-description> <base-branch>` trực tiếp. Toàn bộ code phải implement trong worktree này. Sau khi worktree sẵn sàng, chạy `/make-task <ID> --status "In Progress"` (Claude Code) hoặc `$make-task <ID> --status "In Progress"` (Codex) để đánh dấu task đã bắt đầu.
1. Dùng workflow planning hoặc subagent của harness hiện tại nếu có; nếu không thì chạy plan theo single-agent loop
2. Áp dụng TDD cho từng bước
3. Chạy workflow verification của harness hiện tại nếu có; nếu không thì chạy local checks tương đương trước khi khai báo done
4. Báo cáo hoàn thành cho user và dừng — **không tự commit, không tự push, không tự update status**

## Cấu trúc file

```
make-task/
├── agents/
│   └── openai.yaml
├── SKILL.md
├── README.md
└── references/
    ├── task-detail.template.md     # Template cho docs/tasks/<ID>.md
    └── task-overview.template.md   # Template cho docs/task-overview.md
```
