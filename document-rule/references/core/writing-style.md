# Cách viết rõ ràng, dễ đọc, không lan man

## Viết từng đơn vị thông tin

- Câu: **chủ thể + điều kiện + hành động + kết quả**; tránh đại từ không rõ tham chiếu.
- Đoạn: một ý chính; mở đầu bằng thông tin người đọc cần hành động/hiểu trước.
- Heading: mô tả nội dung thực, không dùng nhãn chung như "Thông tin khác" khi có tên chính xác hơn.
- Danh sách đánh số: thứ tự thao tác; bullet: tập hợp không có thứ tự; bảng: nhiều chiều cần đối chiếu.
- Code/JSON/CLI: chỉ khi cần chính xác; giữ cú pháp, escaping và tên trường đúng nguồn.
- Không lặp lại cùng business rule ở ba nơi; tham chiếu ID.

## Viết thông số đo được

| Mơ hồ | Có thể kiểm tra |
|---|---|
| "xử lý lỗi hợp lý" | "trả mã lỗi E và không cập nhật bản ghi" |
| "nhanh" | "p95 ≤ 300 ms trong tải đo được" **chỉ nếu giới hạn này đã được cung cấp** |
| "hỗ trợ retry" | "retry cùng idempotency key không tạo hiệu ứng lặp" **chỉ nếu được yêu cầu** |
| "test đầy đủ" | "kiểm tra AC-001 đến AC-004 với unit/integration tests" |

## Quy tắc chỉnh sửa

Nếu người dùng yêu cầu rút gọn/chỉnh văn phong, giữ nguyên điều kiện, ngoại lệ, ngưỡng, trạng thái và acceptance. Không thêm feature, không tự sửa quyết định nghiệp vụ. Giảm chữ bằng loại bỏ lặp và lời bình, không bằng bỏ nhánh lỗi quan trọng.
