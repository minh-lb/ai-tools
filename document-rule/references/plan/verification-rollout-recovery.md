# Verification, Rollout và Recovery

## Lập kế hoạch kiểm chứng

- Chọn **unit** cho logic/rule thuần, **integration** cho persistence/API/dependency, **e2e** cho journey quan trọng.
- Với thay đổi tương thích hoặc data migration, xác minh schema/version compatibility, rollback feasibility, dữ liệu trước/sau.
- Ghi **lệnh thực tế** chỉ khi đã kiểm tra repo. Nếu không, mô tả test/check cần chạy.
- Điều kiện Pass/Fail phải là observable signal, không phải "kiểm tra hoạt động ổn định".

## Rollout theo rủi ro

1. Preconditions/backup hoặc recovery point nếu cần.
2. Deploy sequence tương thích (expand → code → contract khi có migration).
3. Health checks/log/metrics cần quan sát.
4. Stop/rollback triggers và quyền quyết định khi biết.
5. Recovery nếu một thao tác không thể tự đảo ngược.

**CAUTION:** DB down migration không đảm bảo hoàn nguyên business data. Không đề xuất rollback phá dữ liệu như giải pháp mặc định.

## Status và evidence

- `Proposed` = kế hoạch chưa thực hiện.
- `Verified in repository` = source đã được khảo sát và dẫn nguồn.
- `Executed` = công việc đã làm, có log/artifact.
- `Passed` = có test/check result chứng minh.

Trong Plan chưa thi công, viết `Verification planned`; không tick checklist `Done` cho lệnh chưa chạy.
