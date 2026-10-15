# Ứng dụng nguyên tắc AMM có chọn lọc

## Lấy nguyên tắc, không sao chép mẫu biểu

Dùng tư duy tài liệu thao tác: **phạm vi → điều kiện sẵn sàng → hành động → kết quả mong đợi → kiểm tra → phục hồi khi cần**. Không áp đặt tiêu đề, mã đánh số, cảnh báo hoặc chương mục ATA/S1000D.

## Mẫu một bước cho runbook/plan

1. **Precondition:** điều kiện bắt buộc trước bước có ảnh hưởng.
2. **Action:** một động từ và một thao tác xác định.
3. **Expected:** trạng thái hoặc artifact quan sát sau bước.
4. **Verify:** phép đo/test/check đủ xác nhận kết quả.
5. **Stop / Recovery:** chỉ khi thao tác có nguy cơ lỗi nghiêm trọng hoặc khó đảo ngược.

Các bước đơn giản có thể gộp `Action + Expected`; không buộc 5 dòng cho mọi thao tác.

## Phân mức cảnh báo

- **WARNING:** tác động nghiêm trọng với người dùng, production hoặc bảo mật; nêu điều kiện ngăn chặn.
- **CAUTION:** dữ liệu, tương thích hoặc kết quả có thể hỏng; mô tả cách giảm thiểu.
- **NOTE:** điều kiện phụ trợ giúp thao tác chính xác, không dùng để che một precondition.

## Ví dụ (minh họa, chưa phải quy trình thực tế)

> **CAUTION:** đổi schema production có thể ảnh hưởng phiên bản ứng dụng cũ.
>
> **Precondition:** xác minh cả phiên bản cũ và mới đọc được schema mở rộng.
>
> **Action:** triển khai migration dạng additive trước code sử dụng cột mới.
>
> **Expected / Verify:** schema mới tồn tại, truy vấn tương thích đạt trong staging.
>
> **Recovery:** dừng rollout khi kiểm tra tương thích thất bại; không tự động xóa cột chứa dữ liệu mới.

Dùng cấu trúc này khi viết hướng dẫn **thực thi**; tài liệu ADR/design ưu tiên quyết định và trade-off hơn quy trình bước.
