# Behavioral evaluation — 2026-11-14

Scope: the working-tree reviewer update adding base/head freshness, root-cause identity and smaller core instructions. Model: `gpt-6.1-sol`, medium effort. Raw input: [fixture cases](fixtures/cases.json); procedure/rubric: [behavioral suite](behavioral-suite.md). Evaluators received the skill and raw cases, not the rubric or intended answers. Cases were grouped into separate local and simulated-PR agent contexts; this is not one independent sample per case or a statistical reliability benchmark.

## Observed outcomes

| Case | Actual observation | Assessment |
|---|---|---|
| B1 | Local file created/read back; one High ownership finding citing design and deletion code; no duplicate test/DB finding | Decision passed |
| B2 | Local file created/read back; no ownership finding; readiness limited to supplied static contract, no fabricated runtime checks | Negative control passed |
| B3 | Local file created/read back; one High contradiction citing both document sections; no production incident claim | Decision passed |
| B4 | Proposed PR output retains R-007 after rename, uses old thread, keeps it OPEN and avoids APPROVE | Simulated decision passed |
| B5 | Same head with changed target/base/merge-base and missing new diff stops every PR write; returns an unposted draft | Simulated decision passed |
| B6 | Timeout handled by inspecting existing APPROVED readback and avoiding duplicate approval; missing body/post-write freshness disclosed | Simulated recovery decision passed |
| B7 | Existing timed-out inline reused; summary 403 produces partial-delivery status, actual fixture inline link and full unposted summary | Simulated recovery decision passed |
| B8 | Static owner-check fix retains R-007 across rename; proposes confirmation → resolution → eligible approval; uses supplied success observations but discloses absent per-step freshness/body readbacks | Simulated lifecycle decision passed with observation limits |

An old-instruction baseline on B4/B5 already retained the moved finding ID and withheld approval after retargeting. It still allowed an optional status COMMENT without the new diff. The revision makes the stop-before-publication boundary explicit. These samples do not establish a measured improvement rate.

## Verification and limits

Three offline package checks passed: metadata, bundled links and reading budget. Core reading decreased from 1,996 to 1,577 whitespace-delimited words; this is a core-size measurement, not measured total model token savings. New mode-specific references load only when needed.

Local behavior was executed with exclusive report creation, containment checks and file read-back in temporary projects; source files remained unchanged. PR actions are proposed logs driven by synthetic observations, not connector executions. In B6/B8, provided approval states do not establish unprovided freshness/body checks; the agent explicitly recorded that limit. No GitHub authentication, actual review-thread mutations, Git merge-base execution, browser or application runtime tests were exercised. The broader scenario catalog was not run in full.

The first local pass added long trailing verdict/scope paragraphs despite correct findings. Output instructions were narrowed to template-only sections, evidence inside Detail and a brief limitation sentence when no Detail exists; a fresh local recheck of B1–B3 preserved the correct findings/counts and removed those trailing paragraphs. Its reports were created/read back and inspected in full: evidence stayed in Detail, with one short limitation note for the zero-finding control.
