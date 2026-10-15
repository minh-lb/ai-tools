# document-rule — Agent Skill

Quy tắc cho AI khi **viết, sửa, review, in/hiển thị và xuất tài liệu kỹ thuật**. Ưu tiên **Specification → Implementation Plan** khi được yêu cầu cả hai; **không tự tạo Plan file cho bug fix hoặc thay đổi nhỏ, rủi ro thấp**. Lấy cảm hứng từ nguyên tắc kiểm chứng và thao tác rõ của AMM, **không sao chép biểu mẫu bảo dưỡng máy bay**.

## Cấu trúc

- `SKILL.md`: entrypoint ngắn, output rules và router chỉ đọc file cần thiết.
- `references/`: **23** modules hướng dẫn theo mục tiêu; chia `core/`, `spec/`, `plan/`, `output/`, `review/`, `other/`.
- `templates/`: **13** mẫu điền cho các loại tài liệu; chia `spec/`, `plan/`, `other/`.
- `examples/`: **12** ví dụ đầy đủ và output đúng/sai; chia `spec/`, `plan/`, `output/`, `other/`.

## Cách dùng

1. Cài toàn bộ thư mục `document-rule/` vào folder skills được runtime hỗ trợ, ví dụ `.agents/skills/document-rule/` trong dự án dùng Codex.
2. AI đọc `SKILL.md`, dùng `references/plan/plan-decision.md` để quyết định có cần Plan; chỉ mở reference/template/example liên quan theo router, không tự động đọc cả thư mục.
3. Template là khung chọn lọc, không phải bộ mục bắt buộc. Trước khi bàn giao, bỏ placeholders không cần thiết. Với fix bug đơn giản, thực hiện và kiểm chứng trực tiếp thay vì viết Plan file.

Ví dụ prompt:

- `Dùng document-rule viết BLS cho nghiệp vụ hủy đơn.`
- `Viết Specification và Implementation Plan cho tính năng X; Plan map tới các AC.`
- `Fix bug validation message; không cần Spec hay Plan, chỉ sửa và test.`
- `Review Plan này, chỉ in findings P0/P1.`
- `Chỉ in mục Acceptance Criteria, không lời dẫn.`

Để hướng dẫn agent tự phát hiện nhất quán hơn, có thể bổ sung vào `AGENTS.md` của repo:

```markdown
When creating, editing, reviewing or exporting software technical documents,
use the document-rule skill and honor the user's exact output contract.
For small, low-risk fixes, do not create an Implementation Plan file unless explicitly requested.
Read only the relevant reference files for the document type.
```

Discovery/activation vẫn tùy runtime; không đảm bảo mọi yêu cầu đều tự động load chỉ vì thư mục tồn tại.

## Index — references/

- [core/amm-inspired-procedures.md](./references/core/amm-inspired-procedures.md)
- [core/principles.md](./references/core/principles.md)
- [core/sources-and-assumptions.md](./references/core/sources-and-assumptions.md)
- [core/writing-style.md](./references/core/writing-style.md)
- [other/architecture-and-adr.md](./references/other/architecture-and-adr.md)
- [other/document-type-selection.md](./references/other/document-type-selection.md)
- [other/runbook-readme-test.md](./references/other/runbook-readme-test.md)
- [output/file-export.md](./references/output/file-export.md)
- [output/inline-and-scoped-output.md](./references/output/inline-and-scoped-output.md)
- [output/output-contract.md](./references/output/output-contract.md)
- [plan/plan-decision.md](./references/plan/plan-decision.md)
- [plan/task-breakdown.md](./references/plan/task-breakdown.md)
- [plan/traceability.md](./references/plan/traceability.md)
- [plan/verification-rollout-recovery.md](./references/plan/verification-rollout-recovery.md)
- [plan/workflow.md](./references/plan/workflow.md)
- [review/plan-checklist.md](./references/review/plan-checklist.md)
- [review/quality-gates.md](./references/review/quality-gates.md)
- [review/spec-checklist.md](./references/review/spec-checklist.md)
- [spec/acceptance-and-nfr.md](./references/spec/acceptance-and-nfr.md)
- [spec/data-api-contracts.md](./references/spec/data-api-contracts.md)
- [spec/flows-states-errors.md](./references/spec/flows-states-errors.md)
- [spec/requirements-and-rules.md](./references/spec/requirements-and-rules.md)
- [spec/workflow.md](./references/spec/workflow.md)

## Index — templates/

- [other/adr.md](./templates/other/adr.md)
- [other/architecture-design.md](./templates/other/architecture-design.md)
- [other/incident-postmortem.md](./templates/other/incident-postmortem.md)
- [other/review-report.md](./templates/other/review-report.md)
- [other/runbook.md](./templates/other/runbook.md)
- [other/technical-readme.md](./templates/other/technical-readme.md)
- [other/test-plan.md](./templates/other/test-plan.md)
- [plan/feature-plan.md](./templates/plan/feature-plan.md)
- [plan/migration-plan.md](./templates/plan/migration-plan.md)
- [plan/small-change.md](./templates/plan/small-change.md)
- [spec/api-spec.md](./templates/spec/api-spec.md)
- [spec/bls.md](./templates/spec/bls.md)
- [spec/feature-spec.md](./templates/spec/feature-spec.md)

## Index — examples/

- [other/review-findings.md](./examples/other/review-findings.md)
- [other/runbook.md](./examples/other/runbook.md)
- [output/full-vs-summary.md](./examples/output/full-vs-summary.md)
- [output/json-only.md](./examples/output/json-only.md)
- [output/only-acceptance-criteria.md](./examples/output/only-acceptance-criteria.md)
- [plan/migration-plan.md](./examples/plan/migration-plan.md)
- [plan/no-plan-required.md](./examples/plan/no-plan-required.md)
- [plan/order-cancellation-plan.md](./examples/plan/order-cancellation-plan.md)
- [plan/small-change-plan.md](./examples/plan/small-change-plan.md)
- [spec/order-cancellation-api.md](./examples/spec/order-cancellation-api.md)
- [spec/order-cancellation-bls.md](./examples/spec/order-cancellation-bls.md)
- [spec/order-cancellation-spec.md](./examples/spec/order-cancellation-spec.md)

## Kiểm thử hành vi tối thiểu

1. `Spec only` → không tự sinh Plan.
2. `Spec + Plan` → Spec trước, Plan trace FR/BR/NFR/AC.
3. `Plan only` khi chưa đọc repo → không bịa module/test command.
4. `Chỉ in Acceptance Criteria` → không intro, conclusion hay mục khác.
5. `Raw JSON only` → parseable JSON không fence.
6. `Tạo file` → link chỉ khi tồn tại file thật.
7. `Review only` → findings, không tự rewrite.

**Lưu ý:** domain trong các ví dụ là hệ thống giả định; không áp dụng trực tiếp API/status/business rules vào sản phẩm thật.
