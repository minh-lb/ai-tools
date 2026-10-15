# Runbooks, READMEs, Test Plans, and Incident Reports

## Runbook / SOP

State the trigger, permissions/prerequisites, warnings, each action with expected result/check, stop conditions, and recovery/escalation. Dangerous commands must name the environment and verification. Use the [AMM-inspired pattern](../core/amm-inspired-procedures.md).

## README / Setup

Cover system requirements, installation based on existing sources, configuration/secrets (never copy real secrets), run/build/test, expected output, troubleshooting, and links. Verify commands; do not add untested shell commands as mandatory steps.

## Test Plan

Define scope/in-scope, test levels, scenarios mapped to acceptance criteria, fixtures and prerequisites, environment, execution instructions, expected results, exit criteria, and known gaps. A test plan is **not** a test report; do not mark anything Passed unless it was run.

## Incident / RCA

Include an evidence-backed timestamped timeline, impact and scope, detection, causal chain, contributing factors, what went well/poorly, and corrective/preventive actions with owners **when confirmed**. Do not infer root cause from correlation; distinguish confirmed causes from hypotheses.

Templates: [Runbook](../../templates/other/runbook.md), [README](../../templates/other/technical-readme.md), [Test Plan](../../templates/other/test-plan.md), [Incident](../../templates/other/incident-postmortem.md).
