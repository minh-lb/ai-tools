# Ví dụ AI Memory

Đây là dữ liệu hư cấu cho dự án Portfolio, minh họa cách điền template và liên kết note. Tên file mã nguồn, lệnh và kết quả kiểm tra đều là giả lập, không phải kết quả kiểm tra repo hiện tại. Không tự ghi các file ví dụ này vào Obsidian.

Config minh họa đặt tại `.agents/ai-memory/project-config.json` của dự án:

```json
{
  "project_id": "portfolio",
  "project_name": "Portfolio",
  "obsidian_mcp_name": "obsidian"
}
```

Thay tên MCP bằng server thực tế của môi trường chạy agent. Thư mục `Projects/` bên dưới mô phỏng phần tương ứng trong Vault; wikilink được tính từ gốc Vault.

## Các file

- [CONTEXT](Projects/Portfolio/CONTEXT.md): mục đích dự án, cấu trúc và điều hướng.
- [CURRENT](Projects/Portfolio/CURRENT.md): kết quả mới nhất, trỏ tới WorkLog hoàn thành.
- [DECISIONS](Projects/Portfolio/DECISIONS.md): quyết định và WorkLog làm căn cứ.
- [Checkpoint](Projects/Portfolio/WorkLogs/2026/10/26/review-form-validation.md): kết quả rà soát ban đầu.
- [Quyết định](Projects/Portfolio/WorkLogs/2026/10/26/centralize-form-validation.md): tiếp nối checkpoint và chọn cách triển khai.
- [Hoàn thành](Projects/Portfolio/WorkLogs/2026/10/26/finish-form-validation.md): tiếp nối log trước, dẫn tới quyết định đã tồn tại.

## Thứ tự lưu

1. 08:55: tạo CONTEXT, chưa liên kết tới các note chưa có.
2. 09:00: lưu checkpoint và xác nhận qua MCP, sau đó tạo CURRENT trỏ tới nó.
3. 09:30: lưu WorkLog quyết định, liên kết checkpoint đã có; cập nhật CURRENT sau khi xác nhận WorkLog.
4. 09:31: tạo DECISIONS, dẫn tới WorkLog quyết định đã xác nhận.
5. 10:00: lưu WorkLog hoàn thành, liên kết log trước và DECISIONS; cập nhật CURRENT trỏ tới sự kiện mới nhất.
6. 10:05: trong một lần cập nhật điều hướng được cho phép, thêm liên kết CURRENT/DECISIONS vào CONTEXT. Không tạo event mới chỉ để thêm các liên kết này.

Các file thể hiện snapshot cuối cùng. Liên kết một chiều là đủ; checkpoint cũ không bị sửa chỉ để trỏ ngược tới log mới.

## Tình huống retry

Nếu WorkLog 09:30 đã lưu nhưng cập nhật CURRENT bị timeout, sau đó sự kiện 10:00 đã hoàn tất, retry 09:30 phải giữ CURRENT ở sự kiện 10:00. Đọc lại để xác định phần nào còn thiếu; không tạo WorkLog trùng hay thêm lại quyết định đã có. Xem [quy tắc khôi phục](../references/save-safety.md).

Nếu retry checkpoint diễn ra sau nửa đêm, giữ nguyên ngày `2026/10/26` và đường dẫn của lần lưu ban đầu. Nếu một event khác trùng mô tả trong ngày, chọn tên như `review-form-validation-2.md`; không ghi đè event trước.
