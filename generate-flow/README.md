# generate-flow

Trace một feature từ đầu đến cuối qua codebase và tạo ra một tài liệu flow chi tiết, có căn cứ từ code thực tế.

## Ngôn ngữ output

Toàn bộ text mô tả viết bằng **tiếng Việt**. Các thuật ngữ kỹ thuật giữ nguyên tiếng Anh: field names, file paths, function names, layer labels (API/Service/Repository...), HTTP methods, status codes, event names, code blocks, và Mermaid diagram labels.

## Skill tạo ra gì

Một file Markdown tại `docs/flow/<feature-name>.md` gồm các section theo thứ tự:

- **Lịch sử chỉnh sửa** — bảng ghi lại mỗi lần tạo hoặc tái tạo tài liệu; các dòng cũ không bao giờ bị xóa
- **Flow Summary** — mô tả logic flow <= 3 câu, sơ đồ `flowchart LR` tổng quan (không có data detail), bảng các bước chính
- **Full Flow** — `sequenceDiagram` thể hiện đồng thời logic flow (ai gọi ai, theo thứ tự nào) và data flow (data shape tại mỗi handoff, thay đổi ra sao qua từng bước); kèm **Chú thích dữ liệu** giải thích đầy đủ data shape khi label quá dài; **Sơ đồ quyết định** nếu flow không tuyến tính
- **Điểm kết thúc** — toàn bộ DB write, event publish, external API call, và response mà flow đi qua
- **Câu hỏi còn mở** — các boundary chưa rõ hoặc hành vi được suy luận (chỉ thêm khi cần)

## Cách dùng

```
/generate-flow <feature-name | file-path | component-name>
```

**Ví dụ:**

```
/generate-flow checkout
/generate-flow src/orders/checkout.service.ts
/generate-flow user-registration
/generate-flow src/notifications/email.worker.ts
```

## Khi nào nên dùng

- Cần hiểu một feature trước khi sửa đổi
- Onboarding engineer mới vào một flow đang có
- Chuẩn bị test case dựa trên các nhánh quyết định và terminal thực tế
- Tài liệu hóa một feature sau khi refactor lớn

## Khi nào nên bỏ qua

- Debug lỗi mà không cần tạo tài liệu → dùng `debugger`
- Đang implement hoặc thay đổi hành vi code
- Thiết kế kiến trúc spanning nhiều service không có trong repo này

## Cấu trúc file

| File | Mục đích |
| --- | --- |
| `SKILL.md` | Định nghĩa skill — được Claude Code load khi gọi `/generate-flow` |
| `templates/flow.template.md` | Skeleton output — cấu trúc tham khảo cho file được tạo |
| `references/example-checkout-flow.md` | Ví dụ monolith — feature checkout NestJS |
| `references/example-order-fulfillment-flow.md` | Ví dụ microservice — event-driven flow qua nhiều service |

## Ví dụ output

Sau khi chạy `/generate-flow checkout`:

```
Flow generated for: checkout
  File: docs/flow/checkout.md
```

Xem `references/` để biết file được tạo ra trông như thế nào.

## Tái tạo tài liệu

Chạy lại skill trên cùng feature sau khi:
- Một PR merge có chạm vào các file của feature đó
- Các layer bị đổi tên hoặc di chuyển
- Có thêm side effect mới (event, cache write)
- Một nhánh logic thay đổi

Mỗi lần chạy sẽ append thêm một dòng vào bảng `Lịch sử chỉnh sửa` — các dòng cũ không bao giờ bị xóa.

## Kết hợp với skill khác

Sau khi tạo flow doc, dùng `backend-testcase-writer` để viết test case dựa trên các nhánh quyết định và terminal đã được tài liệu hóa.
