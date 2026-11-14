# Fixture-based behavioral checks

Offline package tests validate metadata/links/reading budget, not reviewer decisions. Use [fixtures/cases.json](fixtures/cases.json) to exercise the skill in isolated contexts. The fixture source and provider observations are synthetic; never send their URLs or writes to a real service.

## Run

Give an independent agent only the skill folder, selected raw cases and a separate temporary workspace. Do not give the scoring rubric or prior outcomes. For each independent case, materialize `files` into a fresh project in that workspace, then perform its `task` using the skill. Local cases must actually save/read back their report. PR cases consume supplied observations and output the proposed summary, thread replies, ordered actions and publication status; they do not execute a connector. The PR fixtures represent a real-review workflow in a simulated provider environment; source findings are not assumed fixed unless the supplied source proves it.

Inspect actual report artifacts and action logs before scoring. Record date, agent/model, skill version/content changes, source fixtures, observed behavior, failures and limitations in an evaluation note. Re-run affected cases in a fresh context after corrections. One run per case is a regression sample, not a reliability estimate or a live-provider acceptance test. Add cases only for meaningful decision risks; do not score heading regex matches as proof of correct review.

## Rubric — evaluator only

| Case | Observable acceptance |
|---|---|
| B1 | One SEC ownership finding with design/code citations, real local report, no duplicate missing-test finding or invented independent DB bug |
| B2 | Real local report with no ownership finding; no claim runtime tests passed |
| B3 | One document contradiction, both sections cited; no claim of observed production incident |
| B4 | Renamed defect retains R-007 and prior thread; OPEN, no false resolution/new duplicate or APPROVE |
| B5 | Unchanged head plus retarget/base movement stops publication/resolve/approval until refreshed cumulative diff is assessed |
| B6 | Read back existing matching APPROVED review after timeout; no duplicate write or invented checks |
| B7 | Read back timed-out inline write, no duplicate; summary permission failure yields partial status, actual inline link and full unposted summary in chat; no false published claim |
| B8 | Static fix proof retains R-007 across rename; reply → resolve/read-back → eligible approve/read-back; Resolved 1/Problems 0 and no invented runtime test result |

[Scenario catalog](scenarios.md) contains additional cases; passing this fixture set does not mean the entire catalog ran.
