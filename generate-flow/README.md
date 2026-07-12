# generate-flow

Trace một feature từ đầu đến cuối qua codebase và tạo ra một tài liệu flow chi tiết, có căn cứ từ code thực tế.

## Ngôn ngữ output

Toàn bộ text mô tả (mô tả, logic steps, side effects, câu hỏi) viết bằng **tiếng Việt**. Các thuật ngữ kỹ thuật giữ nguyên tiếng Anh: field names, file paths, function names, layer labels (API/Service/Repository...), HTTP methods, status codes, event names, code blocks, và Mermaid diagram labels.

## Skill tạo ra gì

Một file Markdown tại `docs/flow/<feature-name>.md` bao gồm:

- **Tóm tắt** — mô tả ngắn gọn, sơ đồ `flowchart LR` tổng quan, bảng các bước chính, bảng các thay đổi dữ liệu chính
- **Flow đầy đủ** — sequence diagram (data shape tại mỗi handoff), bảng quá trình biến đổi dữ liệu, decision flowchart
- **Phân tích từng layer** — file, function, input/output schemas, các bước logic, bảng thay đổi dữ liệu với change type (CREATE/UPDATE/DELETE/DERIVE/RENAME)
- **Điểm kết thúc** — toàn bộ DB write, event publish, external API call, và response mà flow đi qua
- **Câu hỏi còn mở** — các boundary chưa rõ hoặc hành vi được suy luận, đánh dấu rõ ràng

Skill cũng tự động cập nhật `docs/flow/README.md` làm index cho tất cả flow doc đã tạo.

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
- Chuẩn bị test case dựa trên các nhánh và terminal thực tế
- Tài liệu hóa một feature sau khi refactor lớn

## Khi nào nên bỏ qua

- Debug lỗi mà không cần tạo tài liệu
- Đang implement hoặc thay đổi hành vi code
- Thiết kế kiến trúc spanning nhiều service không có trong repo này

## Cấu trúc file

| File | Mục đích |
| --- | --- |
| `SKILL.md` | Định nghĩa skill — được Claude Code load khi gọi `/generate-flow` |
| `templates/flow.template.md` | Skeleton output — cấu trúc tham khảo cho file được tạo |
| `references/example-checkout-flow.md` | Ví dụ đầy đủ minh họa một feature checkout NestJS |

## Ví dụ output

Sau khi chạy `/generate-flow checkout`:

```
Flow generated for: checkout
  File  : docs/flow/checkout.md
  Index : docs/flow/README.md
```

Xem `references/example-checkout-flow.md` để biết file được tạo ra trông như thế nào.

## Tái tạo tài liệu

Chạy lại skill trên cùng feature sau khi:
- Một PR merge có chạm vào các file của feature đó
- Các layer bị đổi tên hoặc di chuyển
- Có thêm side effect mới (event, cache write)
- Một nhánh logic thay đổi

Mỗi lần chạy sẽ append thêm một dòng vào bảng Edit History — các dòng cũ không bao giờ bị xóa.

## Kết hợp với skill khác

Sau khi tạo flow doc, dùng `backend-testcase-writer` để viết test case dựa trên các nhánh quyết định và terminal đã được tài liệu hóa.
