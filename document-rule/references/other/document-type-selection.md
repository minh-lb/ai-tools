# Chọn đúng loại tài liệu kỹ thuật

| Loại | Câu hỏi chính | Template |
|---|---|---|
| Architecture / System Design | Thành phần nào và vì sao? Luồng dữ liệu? Trade-offs? | [architecture](../../templates/other/architecture-design.md) |
| ADR | Quyết định nào, lựa chọn gì, lý do và hệ quả? | [ADR](../../templates/other/adr.md) |
| Runbook / SOP | Khi nào thao tác? Các bước, check, recovery? | [runbook](../../templates/other/runbook.md) |
| Test Plan | Phạm vi, phương pháp, scenarios, exit criteria? | [test plan](../../templates/other/test-plan.md) |
| README / Setup Guide | Cài, chạy, cấu hình, xác minh ra sao? | [README](../../templates/other/technical-readme.md) |
| Incident / RCA | Điều gì xảy ra, bằng chứng, impact, corrective actions? | [postmortem](../../templates/other/incident-postmortem.md) |
| Review report | Vấn đề, bằng chứng, mức độ, cách sửa? | [review report](../../templates/other/review-report.md) |

Quy tắc chi tiết: [architecture/ADR](architecture-and-adr.md), [runbook/test/README/incident](runbook-readme-test.md).

Chỉ dùng preconditions/ordered steps cho tài liệu **thao tác**. Tài liệu giải thích hoặc quyết định không bị buộc thành procedural manual. Với API docs/contract, áp dụng [API spec rules](../spec/data-api-contracts.md); với functional requirements dùng [Spec rules](../spec/workflow.md).
