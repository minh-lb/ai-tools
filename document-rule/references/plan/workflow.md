# Quy trình viết Implementation Plan

**Điều kiện kích hoạt:** chỉ áp dụng workflow này **sau khi xác định cần viết Plan** theo [quy tắc lựa chọn Plan](plan-decision.md). Không tạo file Plan mặc định cho bug fix/sửa nhỏ. Nếu user yêu cầu rõ Plan, vẫn viết Plan dù task nhỏ.

## Đầu vào / baseline

- Ưu tiên Specification đã thống nhất, acceptance criteria và những phần code/schema/CI đã đọc.
- Nếu chưa có Spec nhưng user **chỉ yêu cầu Plan**, dùng mục `Baseline requirements` ngắn + open questions; không tự tạo một tài liệu Spec đầy đủ.
- Tài liệu Plan là **đề xuất công việc**, không chứng minh đã thực hiện.

## Trình tự

1. Mục tiêu và coverage (`FR/BR/NFR/AC` IDs).
2. Khảo sát code/architecture/conventions có sẵn; phân biệt `verified` và `to inspect`.
3. Impact analysis: API, domain, persistence, data, auth, testing, deploy, monitoring khi liên quan.
4. Giải quyết decision blockers, dependency.
5. Phân nhỏ task theo thứ tự an toàn (inspect → change → verify → release).
6. Gắn requirement/AC vào task, expected result, test; bổ sung migration/rollback khi rủi ro.
7. Definition of Done (đo được) + execution status rõ ràng.

## Không tự giả định

Không chế tên file, package, bảng/cột đã tồn tại, test command, nhân sự, thời gian, story points hoặc trạng thái `Done/Passed`. Nếu chưa kiểm tra repo, dùng `Component to inspect` và `Test command: theo repository, chưa xác minh`.

Dùng [Feature Plan](../../templates/plan/feature-plan.md) hoặc [Small Change](../../templates/plan/small-change.md) **khi Plan là deliverable**. Không dùng Small Change template để biện minh cho việc tự tạo Plan file của một bug fix đơn giản.
