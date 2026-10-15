# document-rule — Agent Skill

Quy tắc cho AI khi **viết, sửa, review, in/hiển thị và xuất tài liệu kỹ thuật**. Lấy cảm hứng từ nguyên tắc kiểm chứng và thao tác rõ của AMM, **không sao chép biểu mẫu bảo dưỡng máy bay**.

## Triết lý

Tài liệu phải đủ rõ để một người có chuyên môn phù hợp, dù không phải tác giả, cũng có thể thực hiện đúng công việc, biết khi nào công việc hoàn thành và biết cách kiểm tra kết quả. Viết tài liệu theo phong cách hướng dẫn bảo dưỡng máy bay (Aircraft Maintenance Manual – AMM) là phương pháp viết tài liệu đề cao tính chính xác, rõ ràng, có cấu trúc, có thể thực hiện và kiểm chứng được.

Skill áp dụng các nguyên tắc về độ chính xác, rõ ràng, cấu trúc, tính thực hiện và kiểm chứng theo mức phù hợp với loại tài liệu; **không** sao chép cấu trúc biểu mẫu hàng không hay ép mọi tài liệu thành quy trình thao tác.

## Cấu trúc

- `SKILL.md`: entrypoint ngắn, output rules và router chỉ đọc file cần thiết.
- `references/`: **23** modules hướng dẫn theo mục tiêu; chia `core/`, `spec/`, `plan/`, `output/`, `review/`, `other/`.
- `templates/`: **14** mẫu điền cho các loại tài liệu; mỗi mẫu có root-level YAML frontmatter với properties dạng placeholder và `status: draft`; chia `spec/`, `plan/`, `other/`.
- `examples/`: **26** file ví dụ được bản địa hóa thành **13 cặp English/Vietnamese**; mỗi file có YAML frontmatter properties, dùng task ID làm `id` nếu có (nếu không thì UUID) và chỉ dùng `status: draft` hoặc `status: approved`; chia `spec/`, `plan/`, `output/`, `other/`.

## Cách dùng

1. Cài toàn bộ thư mục `document-rule/` vào folder skills được runtime hỗ trợ, ví dụ `.agents/skills/document-rule/` trong dự án dùng Codex.
2. AI đọc `SKILL.md`, chỉ mở reference theo router; không preload toàn bộ thư mục, README hay examples. Chỉ mở template khi tạo tài liệu và một example đúng ngôn ngữ khi cần làm rõ mẫu; chỉ đọc Plan decision khi cần quyết định có tạo Plan. Khi sửa/review/export nội dung có sẵn, giữ nguyên ngôn ngữ từng file và các cặp EN/VI, không hỏi lại. Chỉ hỏi `Vietnamese` hoặc `English` trước khi tạo tài liệu mới ra file nếu yêu cầu/ngữ cảnh đã xác nhận chưa chọn ngôn ngữ.
3. Template là khung chọn lọc, không phải bộ mục bắt buộc. Với Plan, Goal phải nêu outcome cụ thể, scope/constraint chính và tín hiệu thành công có thể kiểm chứng; tránh mô tả chung chung. Trước khi bàn giao, bỏ placeholders không cần thiết và review theo góc nhìn independent reader: người có chuyên môn phù hợp nhưng không phải tác giả có thể thực hiện đúng, biết khi nào hoàn thành và kiểm tra kết quả hay không. Với fix bug đơn giản, thực hiện và kiểm chứng trực tiếp thay vì viết Plan file.

Ví dụ prompt:

- `Dùng document-rule viết BLS cho nghiệp vụ hủy đơn.`
- `Viết Specification và Implementation Plan cho tính năng X; Plan map tới các AC.`
- `Fix bug validation message; không cần Spec hay Plan, chỉ sửa và test.`
- `Viết đặc tả sửa lỗi phân trang này bằng tiếng Việt; mô tả hiện trạng và hành vi mong muốn ở hai mục riêng, nêu nguyên nhân đã xác minh hoặc chưa xác định và tiêu chí chấp nhận; chưa cần Implementation Plan.`
- `Review Plan này, chỉ in findings P0/P1.`
- `Review và sửa document-rule qua nhiều vòng đến khi không còn finding cần xử lý trong scope; nêu rõ blocker và finding được hoãn.`
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
- [spec/bug-fix-spec.md](./templates/spec/bug-fix-spec.md)
- [spec/bls.md](./templates/spec/bls.md)
- [spec/feature-spec.md](./templates/spec/feature-spec.md)

## Index — examples/

- [other/review-findings.en.md](./examples/other/review-findings.en.md) / [review-findings.vi.md](./examples/other/review-findings.vi.md)
- [other/runbook.en.md](./examples/other/runbook.en.md) / [runbook.vi.md](./examples/other/runbook.vi.md)
- [output/full-vs-summary.en.md](./examples/output/full-vs-summary.en.md) / [full-vs-summary.vi.md](./examples/output/full-vs-summary.vi.md)
- [output/json-only.en.md](./examples/output/json-only.en.md) / [json-only.vi.md](./examples/output/json-only.vi.md)
- [output/only-acceptance-criteria.en.md](./examples/output/only-acceptance-criteria.en.md) / [only-acceptance-criteria.vi.md](./examples/output/only-acceptance-criteria.vi.md)
- [plan/migration-plan.en.md](./examples/plan/migration-plan.en.md) / [migration-plan.vi.md](./examples/plan/migration-plan.vi.md)
- [plan/no-plan-required.en.md](./examples/plan/no-plan-required.en.md) / [no-plan-required.vi.md](./examples/plan/no-plan-required.vi.md)
- [plan/order-cancellation-plan.en.md](./examples/plan/order-cancellation-plan.en.md) / [order-cancellation-plan.vi.md](./examples/plan/order-cancellation-plan.vi.md)
- [plan/small-change-plan.en.md](./examples/plan/small-change-plan.en.md) / [small-change-plan.vi.md](./examples/plan/small-change-plan.vi.md)
- [spec/order-cancellation-api.en.md](./examples/spec/order-cancellation-api.en.md) / [order-cancellation-api.vi.md](./examples/spec/order-cancellation-api.vi.md)
- [spec/bug-fix-spec.en.md](./examples/spec/bug-fix-spec.en.md) / [bug-fix-spec.vi.md](./examples/spec/bug-fix-spec.vi.md)
- [spec/order-cancellation-bls.en.md](./examples/spec/order-cancellation-bls.en.md) / [order-cancellation-bls.vi.md](./examples/spec/order-cancellation-bls.vi.md)
- [spec/order-cancellation-spec.en.md](./examples/spec/order-cancellation-spec.en.md) / [order-cancellation-spec.vi.md](./examples/spec/order-cancellation-spec.vi.md)

## Kiểm thử hành vi tối thiểu

Dùng các scenario độc lập dưới đây khi thay đổi skill. Đối chiếu **output và tool trace thực tế** với kỳ vọng; đọc quy tắc hoặc kiểm tra link không chứng minh model đã tuân thủ. Nếu chưa chạy với agent, ghi `Chưa kiểm thử hành vi` thay vì `Passed`.

| Scenario / prompt | Kỳ vọng quan sát được |
|---|---|
| `Viết Spec bằng tiếng Việt, chỉ inline` | Có Spec, không tự sinh Plan hoặc hỏi ngôn ngữ |
| `Spec + Plan` | Spec trước; Plan trace FR/BR/NFR/AC |
| `Plan only`, repo chưa được cung cấp | Không bịa module/test command; nêu việc cần inspect |
| `Chỉ in Acceptance Criteria` từ source có sẵn | Trích nguyên văn section; không intro, paraphrase hay mục khác |
| `Raw JSON only` | JSON parse được; không fence hay metadata ngoài schema |
| `Tạo file` | Chỉ link file đã tạo và kiểm tra thực tế |
| `Review only` | Findings có evidence/location; không sửa source |
| `Review và tự fix đến khi sạch` | Sửa → check → review lại toàn scope; không lặp vô ích hoặc gọi sạch khi còn finding bắt buộc |
| `Review/fix` gặp bằng chứng thiếu hoặc thao tác bị từ chối | Nêu blocker, dừng nhánh bị chặn; không thử lệnh tương đương để vượt chặn |
| `Đặc tả sửa lỗi` | Hiện trạng, mong muốn, cause tách riêng; cause có evidence hoặc Unknown; AC rõ; không tự sinh RCA/Plan |
| `Sửa skill/tài liệu này, giữ ngôn ngữ hiện tại` | Không hỏi ngôn ngữ; giữ từng file và EN/VI đồng bộ |
| `Tạo Spec mới ra file`, chưa chọn ngôn ngữ | Hỏi Vietnamese/English rồi chờ; không ghi trước |
| `Sửa file có schema riêng` / file không frontmatter | Giữ schema hiện có; không ép schema mặc định |
| `Đổi requirement trong tài liệu approved` theo schema mặc định | Chuyển draft trừ khi revision mới được user duyệt; giữ ID/created |
| `Viết ADR` / `Fix typo nhỏ` | ADR không thành runbook; typo không tự sinh Spec/Plan |
| `Chỉ sửa một AC` | Chỉ đọc source/reference cần thiết; không preload toàn skill; không cắt điều kiện để tiết kiệm token |

Kiểm tra tĩnh bổ sung: links nội bộ tồn tại; frontmatter hợp lệ theo schema áp dụng; không trùng document ID; template giữ placeholder rõ, output thực không còn placeholder bắt buộc; JSON examples parse được; index và các cặp EN/VI đồng bộ. Không dùng kiểm tra tĩnh để suy ra production readiness.

**Lưu ý:** domain trong các ví dụ là hệ thống giả định; không áp dụng trực tiếp API/status/business rules vào sản phẩm thật.
