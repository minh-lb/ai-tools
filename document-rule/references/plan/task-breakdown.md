# Task Breakdown — tác vụ triển khai có thể thực hiện

## Một task tốt chứa

1. ID (`IMP-01`) và kết quả cần đạt.
2. Covers: requirement/AC liên quan.
3. Prerequisites + dependencies.
4. Actions tuần tự, cụ thể (Inspect / Modify / Add / Run / Verify); không quá nhiều mục tiêu khó test chung.
5. Expected artifact/state sau task.
6. Verification cụ thể và điều kiện pass/fail.
7. Risk, stop condition, recovery nếu thao tác nguy hiểm.

## Mức phân rã

- Task phải đủ nhỏ để một reviewer/agent khác tiếp tục mà không tự suy diễn business rule.
- Không tách vụn các thao tác đơn giản vô nghĩa; nhóm khi dùng chung một outcome và verification.
- Tách bước discovery khỏi implementation nếu path hoặc API convention chưa biết.
- Nếu dependency là decision chưa chốt, nêu blocker thay vì tạo implementation bịa.

## Ví dụ (giả định)

`IMP-02 — Implement guarded cancellation`  
`Covers: BR-001, BR-002, NFR-001; AC-001, AC-002, AC-004`  
`Depends on: IMP-01 (inspect order persistence)`  
`Actions: (1) bổ sung transition PENDING → CANCELLED (2) bảo vệ mutation khỏi concurrency`  
`Expected: request không hợp lệ không đổi trạng thái; tối đa một request hủy thành công`  
`Verification: state-transition tests + concurrent integration test (chưa chạy)`.

**Không** mô tả thuật toán/đường dẫn cụ thể nếu chưa có source. Ước lượng effort chỉ khi được yêu cầu và có dữ liệu làm căn cứ.
