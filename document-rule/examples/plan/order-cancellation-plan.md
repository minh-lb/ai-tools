# Cancel Pending Order — Implementation Plan (ví dụ giả định)

> **PLAN-ORDER-001 · Status: Proposed · Baseline:** [SPEC-ORDER-001](../spec/order-cancellation-spec.md)  
> Repo chưa được khảo sát; không có code/test/deploy nào được thực hiện.

## Goal & Coverage

Triển khai `FR-001`, `FR-002`, `BR-001…BR-004`, `NFR-001` và `AC-001…AC-004` của Spec giả định.

## Preconditions / Impact

- Cần inspect routing, domain service, auth rules, trạng thái order, persistence schema và test framework.
- Component dự kiến: API layer, domain/business logic, persistence và tests. Chưa có file path đã xác minh.
- **CAUTION:** trạng thái có thể bị race; kiểm tra trước rồi update không bảo vệ concurrency chưa đáp ứng NFR-001.

## Tasks

### IMP-01 — Inspect existing flow

- Covers: prerequisites của toàn bộ Spec.
- Actions: (1) xem order contract/status/permissions; (2) kiểm tra `cancelledAt` và cơ chế update có điều kiện; (3) xác minh conventions lỗi/test.
- Expected: danh mục modules thật, blockers và evidence từ repo.
- Verification: source/schema/test inspection. **Not executed**.

### IMP-02 — Implement guarded state transition

- Covers: BR-001, BR-002, NFR-001; AC-001, AC-002, AC-004.
- Depends: IMP-01.
- Actions: (1) triển khai transition PENDING → CANCELLED theo kiến trúc đã kiểm tra; (2) đặt `cancelledAt`; (3) bảo vệ concurrency; (4) nếu thiếu field, lập migration tương thích.
- Expected: invalid status không mutation; tối đa một successful transition.
- Verification: unit/integration/concurrent tests. **Planned**.

### IMP-03 — Wire API & authorization

- Covers: FR-001, FR-002, BR-003, BR-004; AC-001, AC-003.
- Depends: IMP-01, IMP-02.
- Actions: (1) gắn endpoint; (2) kiểm tra auth, ownership; (3) map HTTP status/response theo Spec.
- Expected: đúng contract; lỗi không mutation.
- Verification: API integration tests cho 200, 401, 403, 404, 409. **Planned**.

### IMP-04 — Validate and document

- Covers: AC-001…AC-004.
- Depends: IMP-02, IMP-03.
- Actions: (1) bổ sung regression tests; (2) chạy test/lint/typecheck theo repo sau khi xác minh lệnh; (3) cập nhật API docs.
- Expected: test artifacts/evidence và docs đồng bộ.
- Verification: review test results. **Not run**.

## Traceability

| Spec/AC | Task | Verification |
|---|---|---|
| BR-001, BR-002, NFR-001 / AC-001, AC-002, AC-004 | IMP-02, IMP-04 | state + concurrency tests |
| FR-001, FR-002, BR-003, BR-004 / AC-001, AC-003 | IMP-03, IMP-04 | API/authorization integration tests |

## Definition of Done

- [ ] AC-001…AC-004 có evidence test Passed thực tế.
- [ ] Không có race tạo hai successful transitions.
- [ ] Chạy checks repo đã xác minh, cập nhật API docs.
- [ ] Nếu có migration, đã review compatibility và recovery.

**Current status:** Proposed — no implementation or test executed.
