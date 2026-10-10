<!-- Save the completed report as docs/review-code/<YYYY-MM-DD>-<short-description>.md. Replace all placeholders and remove HTML comments. Use the current local date and a sanitized lowercase kebab-case slug. -->
# Báo cáo Code Review — {{short-description}}

- **Ngày:** {{YYYY-MM-DD}}
- **Chế độ:** {{codebase | git-diff}}
- **Phạm vi:** {{module, service, files, or changed behavior}}
- **Revision / diff:** {{for branches: <base>...<head> plus base, merge-base, and head SHAs; otherwise PR, commit range, or patch}}
- **Ngoại lệ:** {{material exclusions, or “Không có”}}

## Checklist

| Code | Hạng mục | Trạng thái |
|---|---|---|
| CORR | Correctness | {{🔴 Critical / 🟠 High / 🟡 Medium / 🔵 Low / ✅ Đạt / — N/A}} |
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

<!-- Keep all 14 rows. Status is the worst finding in that dimension. Allowed statuses: 🔴 Critical, 🟠 High, 🟡 Medium, 🔵 Low, ✅ Đạt, — N/A. Explain N/A in Summary if the reason is not obvious from the scope. -->

## Findings

<!-- Sort by severity descending and repeat this block for each finding. If no issues were found, replace the block with an explicit no-findings statement and state what was covered. -->

- [{{CORR | SEC | PERF | ARCH | DB | API | UI | A11Y | TEST | MAINT | OBS | CONC | INFRA | COMPAT}}] {{Critical | High | Medium | Low}} — {{short description}}.

  Path: {{repository-verified path/to/file.ext:line-or-range}}

  Why: {{trigger condition, evidence, impact, and affected actor/system}}

  Fix: {{practical remediation direction}}

## Summary

1. **Phạm vi/revision:** {{reviewed code, revision or diff source, and material exclusions}}
2. **Rủi ro/giả định:** {{main risks, open questions, confidence limits, and any aggregate risk}}
3. **Checks:** {{exact checks/commands and results; state what was not run and why}}
