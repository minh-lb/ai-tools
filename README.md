# Lumin

Lumin là plugin dùng để cài và phân phối bộ skill chung cho cả **Codex** và **Claude Code**.

Plugin này không chứa source skill cố định trong nhánh hiện tại. Thay vào đó, các skill được lấy từ nhánh `agent-skills` ở bước cài đặt hoặc đồng bộ. Nhánh này chỉ giữ:

- manifest plugin cho Codex
- marketplace local
- script cài đặt cho Codex và Claude Code
- script đồng bộ skill từ nhánh `agent-skills`

## Cách gọi skill

- Trên **Codex**: dùng namespace `lumin:<skill-name>`
  - Ví dụ: `$lumin:bugfix`
- Trên **Claude Code**: dùng slash command `/lumin:<skill-name>`
  - Ví dụ: `/lumin:bugfix`

## Skill source

Nguồn skill duy nhất là nhánh `agent-skills`.

Khi cài:

- **Codex** sẽ hydrate skill tạm thời từ `agent-skills`, cài plugin, rồi dọn phần skill tạm
- **Claude Code** sẽ hydrate skill từ `agent-skills`, copy vào `.lumin/skills`, rồi tạo các command `/lumin:<skill-name>` trong `.claude/commands`

## Vị trí plugin

Plugin nằm tại [plugins/lumin](/Users/minhluu/Sources/github/minhluudev/ai-tools/plugins/lumin).

## Cài đặt nhanh

### Codex

```bash
plugins/lumin/scripts/install-codex.sh
```

Sau đó mở thread mới và dùng:

```text
Use $lumin:bugfix to ...
```

### Claude Code

```bash
plugins/lumin/scripts/install-claude.sh
```

Sau đó dùng:

```text
/lumin:bugfix mô tả lỗi cần xử lý
```

## Đồng bộ lại skill

Nếu nhánh `agent-skills` có thay đổi và bạn muốn materialize bản local để kiểm tra:

```bash
plugins/lumin/scripts/sync-agent-skills.sh
```
