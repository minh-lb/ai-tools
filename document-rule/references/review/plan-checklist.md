# Checklist review Implementation Plan

- [ ] Baseline Spec / request và version đủ rõ?
- [ ] Mọi task cover đúng requirement/AC, không thêm scope tùy tiện?
- [ ] Phân biệt source đã kiểm tra và module giả định cần khảo sát?
- [ ] Impact analysis đủ các lớp liên quan, không thổi phồng?
- [ ] Bước có action cụ thể, expected result, verification?
- [ ] Dependencies, blocker và thứ tự an toàn rõ?
- [ ] Tests cho success/error/boundary/concurrency tương xứng Spec?
- [ ] Migration/rollout/compatibility/recovery có rủi ro nào bị bỏ trống?
- [ ] DoD kiểm tra được, không tick `done` trước khi chạy?
- [ ] Không bịa file path, CLI, effort, owner, lịch release hoặc test results?
- [ ] Traceability matrix không bỏ sót requirement quan trọng?

**Finding format:** `Severity — Task/section — Missing/contradiction — Impact — Fix`. Nếu thiếu repo, báo phần cần inspect; không xem đó là bằng chứng triển khai đã đúng.
