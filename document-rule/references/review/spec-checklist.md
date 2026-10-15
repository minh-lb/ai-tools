# Checklist review Specification

- [ ] Objective/out-of-scope rõ, không lấn implementation design?
- [ ] Actor, trigger, input, permission, preconditions rõ?
- [ ] FR/BR có ID ổn định và một ý test được?
- [ ] State/flow/decision table có mâu thuẫn không?
- [ ] Alternative, validation, authorization, invalid state, concurrency/retry đã xét theo rủi ro?
- [ ] Response, error code, field names, side effects nhất quán với contract?
- [ ] Các NFR có căn cứ, measurement và test khi áp dụng?
- [ ] Mỗi requirement quan trọng có acceptance hoặc explicit exception?
- [ ] As-is facts có evidence? To-be rules có đúng là yêu cầu thay vì claim đã triển khai?
- [ ] Không lén chọn kỹ thuật implementation khi chưa phải constraint?
- [ ] Không để `TBD` dưới dạng điều kiện đã được phê duyệt?

**Finding format:** `Severity — Location/ID — Evidence — Impact — Proposed correction`. Không rewrite nếu chỉ được yêu cầu review.
