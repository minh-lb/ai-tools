# Báo cáo Code Review — {{subject}}

- **Ngày:** {{local YYYY-MM-DD}}
- **Chế độ / phạm vi:** {{mode, inspected scope and material exclusions}}
- **Source:** {{resolved SHAs/comparison, dirty state, or supplied patch identity and coordinate basis}}

## Checklist

| Code | Hạng mục | Trạng thái |
|---|---|---|
| CORR | Correctness | {{status}} |
| SEC | Security | {{status}} |
| PERF | Performance | {{status}} |
| ARCH | Architecture | {{status}} |
| DB | Database | {{status}} |
| API | API | {{status}} |
| UI | Frontend UI | {{status}} |
| A11Y | Accessibility | {{status}} |
| TEST | Testing | {{status}} |
| MAINT | Maintainability | {{status}} |
| OBS | Observability | {{status}} |
| CONC | Concurrency | {{status}} |
| INFRA | Infrastructure | {{status}} |
| COMPAT | Backward Compatibility | {{status}} |

<!-- All rows required. Worst independent severity (Critical/High/Medium/Low),
✅ Đạt = assessed/no finding, ⚪ Chưa xác minh = insufficient assessment,
— N/A = absent surface. Explain material gaps and non-obvious N/A below. -->

## Findings

<!-- Descending severity, one root cause per finding. If none, explicitly say so.
Replace/remove all placeholders and authoring comments. -->

- [{{CODE}}] {{Severity}} — {{short description}}

  Path: {{verified path:line or range, with base/head/patch side when needed}}

  Why: {{evidence, reachable trigger, concrete impact}}

  Fix: {{practical remediation and regression check when needed}}

## Kết luận

**Disposition:** {{Ready | Changes requested | Needs verification}} — {{reason}}

## Summary

- **Rủi ro / giả định:** {{material assumptions, residual risk, uninspected paths and unresolved questions; no invented findings}}
- **Checks:** {{exact commands, environment/revision and actual results; checks not run and why}}
- **Xác minh tiếp:** {{specific check/evidence needed for each material gap, or none}}
