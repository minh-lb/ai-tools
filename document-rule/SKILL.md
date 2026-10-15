---
name: document-rule
description: >-
  Viết, chỉnh sửa, review, hiển thị và xuất tài liệu kỹ thuật phần mềm.
  Ưu tiên Specification (SRS, BLS, API/Feature Spec); Implementation Plan
  chỉ tạo khi task cần và phạm vi output cho phép;
  áp dụng nguyên tắc AMM có chọn lọc, kiểm chứng được, tuân thủ chính xác
  nội dung/định dạng output người dùng yêu cầu. Dùng khi tạo tài liệu kỹ thuật,
  đặc tả nghiệp vụ, kế hoạch triển khai, runbook, ADR, design, test plan,
  README hoặc xuất một phần/toàn bộ tài liệu.
---

# document-rule

## Mục tiêu

Viết tài liệu **đúng sự thật, đúng phạm vi, rõ nghĩa, có thể sử dụng và kiểm chứng**.
Học từ AMM: chỉ rõ điều kiện, hành động, kết quả kỳ vọng, điểm kiểm tra và cách phục hồi khi có rủi ro.
**Không** sao chép biểu mẫu/chương mục ngành hàng không hoặc ép mọi tài liệu thành runbook.

## Quy trình bắt buộc (ngắn)

1. **Xác định output contract**: người dùng muốn loại tài liệu/phần nào, mức chi tiết nào, định dạng nào, ngôn ngữ nào, in trong chat hay tạo file? Không tự thêm deliverable.
2. **Phân loại đầu việc và quyết định có cần Plan không**: bug fix/thay đổi nhỏ, rủi ro thấp thì không tạo Plan file mặc định. Sau đó chỉ đọc các reference đúng nhu cầu; không tải cả thư mục.
3. **Xác minh nguồn**: ưu tiên user, file/code/tài liệu đã đọc; phân biệt `Đã xác minh`, `Giả định`, `Chưa xác định`; tuyệt đối không dựng dữ kiện.
4. **Soạn khi có yêu cầu tài liệu**: nêu WHAT/WHY trong Spec, HOW/ORDER/VERIFY trong Plan; chèn guardrails/rủi ro theo mức độ thực tế. Không tự sinh Spec/Plan từ một yêu cầu sửa code nhỏ.
5. **Review** theo checklist phù hợp, kiểm tra traceability Spec → Plan khi người dùng yêu cầu cả hai.
6. **Chỉ xuất đúng nội dung** người dùng yêu cầu; nếu tạo file thì xác minh file thực tế trước khi gửi link.

## Router — chỉ đọc file cần thiết

| Tác vụ | References cần đọc | Template (khi tạo mới) | Example (khi cần minh họa) |
|---|---|---|---|
| Mọi tài liệu | [core/principles](references/core/principles.md), [core/sources](references/core/sources-and-assumptions.md) | — | — |
| Quyết định **có cần file Plan?** / task code, bug fix | [plan/decision](references/plan/plan-decision.md) | — | [No Plan](examples/plan/no-plan-required.md) |
| Viết Spec / SRS | [spec/workflow](references/spec/workflow.md), [spec/requirements](references/spec/requirements-and-rules.md), [spec/acceptance](references/spec/acceptance-and-nfr.md) | [Feature Spec](templates/spec/feature-spec.md) | [Spec](examples/spec/order-cancellation-spec.md) |
| Viết BLS, business flows | [spec/rules](references/spec/requirements-and-rules.md), [spec/flows](references/spec/flows-states-errors.md) | [BLS](templates/spec/bls.md) | [BLS](examples/spec/order-cancellation-bls.md) |
| Viết API Spec | [spec/api](references/spec/data-api-contracts.md), [spec/acceptance](references/spec/acceptance-and-nfr.md) | [API Spec](templates/spec/api-spec.md) | [API](examples/spec/order-cancellation-api.md) |
| Viết Implementation Plan | [plan/workflow](references/plan/workflow.md), [plan/tasks](references/plan/task-breakdown.md), [plan/traceability](references/plan/traceability.md) | [Feature Plan](templates/plan/feature-plan.md) | [Plan](examples/plan/order-cancellation-plan.md) |
| **Viết Plan đã được yêu cầu** cho thay đổi nhỏ / migration | [plan/decision](references/plan/plan-decision.md), [plan/tasks](references/plan/task-breakdown.md), [plan/verification](references/plan/verification-rollout-recovery.md) | [Small Change](templates/plan/small-change.md) / [Migration](templates/plan/migration-plan.md) | [Small](examples/plan/small-change-plan.md) / [Migration](examples/plan/migration-plan.md) |
| Architecture, ADR, README, Runbook, Test | [other/selection](references/other/document-type-selection.md) rồi chọn reference chuyên biệt trong đó | Xem `templates/other/` | Xem `examples/other/` |
| Viết hướng dẫn thao tác có rủi ro | [core/AMM](references/core/amm-inspired-procedures.md), [plan/verification](references/plan/verification-rollout-recovery.md) | [Runbook](templates/other/runbook.md) | [Runbook](examples/other/runbook.md) |
| Review tài liệu | [review/quality](references/review/quality-gates.md), [review/spec](references/review/spec-checklist.md) hoặc [review/plan](references/review/plan-checklist.md) | [Review report](templates/other/review-report.md) | [Findings](examples/other/review-findings.md) |
| Mọi câu trả lời / in / xuất file | [output/contract](references/output/output-contract.md); thêm [inline](references/output/inline-and-scoped-output.md) hoặc [file](references/output/file-export.md) theo nhu cầu | — | [Output examples](examples/output/only-acceptance-criteria.md) |

## Luật áp dụng ngay, kể cả khi chưa mở reference

- **Không mặc định tạo Implementation Plan file cho mọi task.** Bug fix/sửa đổi cục bộ rủi ro thấp → sửa trực tiếp và kiểm chứng; task trung bình → checklist ngắn nếu cần, không tạo file; task rủi ro cao → chuẩn bị trình tự và verification, chỉ tạo file Plan khi user yêu cầu hoặc repo/project quy định. Chi tiết: [plan-decision](references/plan/plan-decision.md).
- Chỉ viết **Spec trước rồi Plan** nếu **cả hai** được yêu cầu. Nếu chỉ yêu cầu Plan, lập Plan dựa vào baseline có sẵn; không sinh thêm full Spec. Nếu user yêu cầu Plan dù task nhỏ, vẫn tạo Plan phù hợp.
- Không bịa API/schema/path/test result/điều kiện nghiệp vụ. Không dùng ví dụ làm bằng chứng cho hệ thống thật.
- Spec mô tả behavior + exceptions + acceptance criteria; Plan mô tả bước thực hiện + dependency + expected result + verification.
- Mọi thông tin quan trọng phải dễ tìm và kiểm tra. Bỏ phần template không áp dụng thay vì để mục rỗng.
- Khi user yêu cầu **“chỉ in X”**, xuất chính **X**; không thêm lời dẫn, khuyến nghị, plan hay tóm tắt.
- Khi user yêu cầu **“toàn bộ”**, không thay bằng summary/`...`/placeholder. Khi user yêu cầu file, phải có file thật và link đúng.
- Không tuyên bố đã đọc repo, chạy test, tạo file hoặc deploy nếu chưa thực hiện.

**Tài liệu điều hướng:** [README.md](README.md). Đọc [references/core/writing-style.md](references/core/writing-style.md) khi cần chỉnh độ rõ ràng/ngắn gọn.
