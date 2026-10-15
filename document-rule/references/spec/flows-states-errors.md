# Behavior Flow, State Transition và Error Handling

## Flow

- **Trigger → Authorization → Validation → Business decision → Mutation/side effects → Response**: dùng làm checklist, không phải thứ tự mặc định cho mọi hệ thống.
- Mỗi bước nói **điều gì xảy ra**, không nói chi tiết cách code trừ khi đặc tả technical design.
- Liên kết bước với `FR-*`/`BR-*`, không định nghĩa hai bản khác nhau của cùng một rule.

## State machine

Khi có state, nêu transition hợp lệ và bị cấm; ai được phép chuyển; dữ liệu thay đổi kèm theo; invariant phải giữ.

| Current | Trigger | Next | Condition |
|---|---|---|---|
| PENDING | cancel | CANCELLED | owner + authenticated |
| SHIPPED | cancel | unchanged | rejected |

Bảng là ví dụ minh họa. Nếu trạng thái thật chưa biết, **không tự phát minh enumeration**.

## Lỗi và tác dụng phụ

Mỗi lỗi quan trọng phải có: điều kiện → observable response/error → state/database/event có thay đổi không. Cần quy định lỗi có retry được hay không **khi có contract**. Nêu thứ tự ưu tiên lỗi nếu cùng một request có thể thỏa nhiều nhánh lỗi và thứ tự ảnh hưởng đến thông tin bị lộ.

## Đồng thời / idempotency

Đặc tả thuộc tính mong muốn (ví dụ "tối đa một transition thành công") thay vì ép ngay cơ chế kỹ thuật như locking/transaction. Cơ chế thuộc Implementation Plan hoặc Design.
