# Quy trình viết Specification

## Xác định spec thuộc loại gì

- **Feature/SRS:** kỳ vọng observable đối với một tính năng hoặc hệ thống.
- **BLS:** business rules, quyết định, trạng thái và side effects.
- **API Specification:** interface contract; không tự biến thành implementation details.

## Thứ tự soạn

1. Objective và in/out-of-scope.
2. Actor, trigger, input và preconditions.
3. Thuật ngữ, trạng thái, business invariants.
4. Functional requirements có ID (`FR-*`), business rules (`BR-*`).
5. Happy path, alternative/error paths, side effects.
6. Contract dữ liệu/API nếu thuộc phạm vi.
7. NFR có căn cứ (`NFR-*`) và acceptance criteria (`AC-*`).
8. Mâu thuẫn/open questions, rồi review traceability.

## Mức chi tiết

- **Small:** scope + behavior/rules/errors + AC.
- **Feature:** actors + FR/BR + flows + errors + data/API (nếu có) + AC.
- **System / cross-service:** thêm state transitions, concurrency, compatibility, security, observability theo rủi ro.

**Boundary:** Spec không được lén chọn tech stack/đặt file path/chiến lược transaction trừ khi đã là constraint người dùng cung cấp hoặc technical design spec được yêu cầu.

Dùng [Feature Spec template](../../templates/spec/feature-spec.md) cho spec tổng quát; [BLS](../../templates/spec/bls.md) hoặc [API](../../templates/spec/api-spec.md) cho phân loại chuyên biệt.
