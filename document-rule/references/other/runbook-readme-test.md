# Runbook, README, Test Plan và Incident Report

## Runbook / SOP

Trigger, permissions/prerequisites, warnings, từng action + expected/check, stop conditions, recovery/escalation. Lệnh nguy hiểm phải rõ environment và verification. Dùng [AMM pattern](../core/amm-inspired-procedures.md).

## README / Setup

Yêu cầu hệ thống, cài đặt theo source hiện có, config/secrets (không chép secrets thật), run/build/test, expected output, troubleshooting, links. Command phải được xác minh; không tự thêm shell command chưa kiểm thử như bắt buộc.

## Test Plan

Scope/in-scope, test levels, scenarios map tới AC, fixtures và prerequisites, env, execution instructions, expected results, exit criteria, known gaps. Plan kiểm thử **khác** test report; không tick Passed nếu chưa chạy.

## Incident / RCA

Timeline gắn timestamps/evidence, impact và phạm vi, detection, causal chain, contributory factors, what went well/poorly, corrective/preventive actions và ownership **khi được xác nhận**. Không suy đoán root cause từ tương quan; phân biệt confirmed và hypotheses.

Templates: [Runbook](../../templates/other/runbook.md), [README](../../templates/other/technical-readme.md), [Test Plan](../../templates/other/test-plan.md), [Incident](../../templates/other/incident-postmortem.md).
