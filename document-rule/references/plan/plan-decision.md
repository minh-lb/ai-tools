# Quy tắc quyết định khi nào cần Implementation Plan

> **Mặc định:** không tạo file Plan chỉ vì đang làm task code. Phân loại mức độ thay đổi trước; nếu task đơn giản, triển khai và kiểm chứng trực tiếp. Tách biệt **suy nghĩ/lập bước làm nội bộ** với **tạo tài liệu Plan**.

## Quy trình quyết định (đọc từ trên xuống)

1. **Yêu cầu tường minh:** Nếu user yêu cầu viết/xuất/ghi file Plan, tạo Plan đúng phạm vi kể cả task nhỏ. Nếu user yêu cầu **không tạo Plan**, không tạo file. Tuân theo hướng dẫn repo/project có thẩm quyền nếu có và không xung đột chỉ dẫn cao hơn.
2. **Không có yêu cầu Plan:** kiểm tra quy mô tác động, rủi ro và phụ thuộc sau khi đọc context/code cần thiết. Không quyết định chỉ từ tên task.
3. **Task nhỏ, rủi ro thấp:** sửa thẳng, viết/chạy kiểm tra phù hợp, báo kết quả ngắn gọn. **Không tạo file Plan và không bắt user duyệt Plan.**
4. **Task trung bình:** nếu cần, dùng checklist ngắn *trong quá trình làm việc hoặc câu trả lời*, **không tự tạo file** `plan.md`.
5. **Task phức tạp/rủi ro cao:** nên lập thứ tự và phương án kiểm chứng/rollback **trước khi sửa**. Chỉ ghi thành **file Plan** khi user yêu cầu, repo/project quy định, hoặc đầu việc được giao thực chất là soạn tài liệu kế hoạch. Nếu chưa có quyền/chỉ dẫn tạo file, giữ ở dạng phân tích hoặc trao đổi cần thiết; không tự bổ sung deliverable.
6. **Trong khi sửa:** nếu phát hiện tăng scope/rủi ro, đánh giá lại. Không vì lúc đầu có vẻ nhỏ mà bỏ qua kiểm chứng hay cảnh báo.

## Phân loại thực hành

| Mức | Tín hiệu điển hình | Cách làm mặc định (khi user không yêu cầu Plan) |
|---|---|---|
| **Nhỏ / đơn giản** | Sửa typo, thông báo lỗi, điều kiện đơn lẻ, test nhỏ; phạm vi cục bộ thường 1–2 file; không đổi contract/schema, không migration; cách verify rõ | **Không tạo Spec hoặc Plan file.** Sửa trực tiếp + test phù hợp |
| **Trung bình** | Thay đổi vài thành phần liên quan, có bước phụ thuộc nhưng không có rủi ro rollout đáng kể | Phác checklist ngắn nếu cần; không tạo file Plan mặc định |
| **Lớn / rủi ro cao** | Nhiều module/service, thay đổi public API/schema/data, migration, auth/permission, concurrency, tương thích ngược, production rollout, nhiều giai đoạn hoặc có nguy cơ mất dữ liệu | Lập trình tự/verification/recovery trước; **file Plan chỉ khi được yêu cầu hoặc quy định** |

Những dấu hiệu là **heuristic**, không phải ngưỡng cứng: 1 file sửa quyền truy cập có thể rủi ro cao; nhiều file rename máy móc có thể rủi ro thấp. Chú trọng **blast radius**, dữ liệu và hậu quả, không chỉ đếm file.

## Ranh giới quan trọng

- **Không đánh đồng** "task cần các bước thực hiện" với "task cần xuất một file Implementation Plan".
- **Không tự viết full Spec** trước khi sửa một bug nhỏ, trừ khi user yêu cầu hoặc cần chốt business rule chưa rõ.
- Nếu user chỉ yêu cầu **fix bug**, deliverables mặc định là code/thay đổi được yêu cầu và bằng chứng kiểm chứng phù hợp, **không phải** Spec + Plan.
- Nếu user yêu cầu **Spec + Plan**, làm cả hai theo thứ tự Spec → Plan; không tự cắt Plan với lý do task nhỏ. Có thể đề xuất plan rút gọn nếu user cho phép.
- Nếu user chỉ yêu cầu **Plan**, chỉ viết Plan, không tự triển khai code hoặc sinh Spec đầy đủ.
- Nếu user yêu cầu **chỉ in đúng phần X** hoặc không giải thích, không thêm bảng đánh giá mức độ hay lý do bỏ Plan vào output.

## Ví dụ quyết định

- "Sửa lỗi thông báo validation không đúng trên màn hình login"; đổi cục bộ, không thay contract và test rõ → **sửa trực tiếp, không file Plan**.
- "Sửa bug index trong phép tính, bổ sung unit test" → **không file Plan** nếu không phát hiện ảnh hưởng mở rộng.
- "Chuyển schema order nhiều service và deploy không downtime" → **cần tính trước bước triển khai, migration, verify, recovery**; tạo file Plan khi được yêu cầu/quy định.
- "Tạo Implementation Plan cho lỗi typo" → **có Plan** vì user yêu cầu rõ (dùng bản tối giản).

Xem [workflow](workflow.md), [task breakdown](task-breakdown.md) khi **đã xác định cần viết Plan** và [ví dụ không cần file Plan](../../examples/plan/no-plan-required.md).
