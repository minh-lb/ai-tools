# Skill AI Memory

Lưu bộ nhớ dự án qua Obsidian MCP có sẵn trong môi trường chạy agent, giúp tiếp tục công việc, lưu tiến độ và ghi lại các quyết định quan trọng.

## Thiết lập

Cài thư mục này làm skill trong môi trường chạy agent và bật Obsidian MCP. Tạo `.agents/ai-memory/project-config.json` trong mỗi dự án với đúng ba trường:

```json
{
  "project_id": "portfolio",
  "project_name": "Portfolio",
  "obsidian_mcp_name": "obsidian"
}
```

`project_id` là mã định danh cố định gồm chữ thường, chữ số và dấu gạch nối; `project_name` là tên thư mục hợp lệ nằm trực tiếp trong `Projects/`. `obsidian_mcp_name` là tên MCP server đã cấu hình trong môi trường chạy agent; skill chỉ dùng server này. Không cần CLI hay đường dẫn Vault.

Thêm [đoạn hướng dẫn mẫu](templates/AGENTS.snippet.md) vào `AGENTS.md` của dự án (hoặc file chỉ dẫn tương đương). Đoạn này yêu cầu gọi skill ở đầu mỗi phiên và cho phép tự lưu tiến độ; chỉ cài skill chưa bảo đảm AI sẽ chọn nó trong mọi phiên.

## Sử dụng

Khi đã thiết lập, agent tự đọc memory một lần ở đầu phiên và tự lưu khi có tiến độ, quyết định, trở ngại hoặc kết quả đáng lưu. Không ghi log cho trao đổi nhỏ hay nội dung đã lưu; yêu cầu chỉ đọc hoặc không dùng memory luôn được ưu tiên.

Cũng có thể yêu cầu trực tiếp: “Tiếp tục dự án từ bộ nhớ” hoặc “Lưu tiến độ công việc này”. Không có config thì bỏ qua tự động; lỗi config/MCP được báo một lần để công việc độc lập vẫn tiếp tục.

Ghi chú nằm trong `Projects/<project_name>/`: `CONTEXT.md`, `CURRENT.md`, `DECISIONS.md` và `WorkLogs/<year>/<month>/<day>/<short-description>.md` (ví dụ `WorkLogs/2026/10/25/refactor-memory.md`).

Mỗi loại ghi chú có [template và YAML properties](references/note-properties.md) riêng. Xem [ví dụ hoàn chỉnh](examples/README.md) và [hướng dẫn liên kết ghi chú](references/note-links.md).

Việc lưu cần thực hiện tuần tự cho cùng dự án nếu MCP không hỗ trợ ghi có điều kiện. Xem [quy tắc lưu và khôi phục](references/save-safety.md).

Xem [SKILL.md](SKILL.md) để biết quy trình kiểm tra ghi chú thuộc đúng dự án, cập nhật an toàn và khôi phục khi chỉ lưu được một phần.
