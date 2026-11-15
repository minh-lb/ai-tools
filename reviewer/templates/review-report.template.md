## 🔍 Review lần {{round}} - {{local YYYY/MM/DD HH:mm}}

✅ Resolved ({{resolved_count}}), ⚠️ Problems ({{problem_count}})

Ưu tiên: 🔴 High ({{high_count}}), 🟠 Medium ({{medium_count}}), 🟡 Low ({{low_count}})

<!-- Unique finding IDs. Add 🚨 Critical when nonzero. PR/MR always preview and
confirm exact action types before posting; Ready never authorizes approve. -->

### 🔎 Scope & Verification

- **Nguồn/snapshot:** {{source/provider + repository/PR-MR and base/head SHAs or file snapshot}}
- **Đã kiểm tra:** {{actual commands/results or "Chưa chạy kiểm thử runtime"}}
- **Giới hạn:** {{material uninspected areas or "Không có giới hạn đáng kể"}}
- **Kết luận:** {{Changes requested | Needs verification | Ready}}

---

### ✅ Resolved: {{resolved_count}}

- [{{severity_emoji}} {{Severity}}] {{R-ID}} — {{title}}. Xác minh: {{current source/check proving fix}}.

<!-- If none say "Không có". Keep stable prior IDs. For PR/MR resolved threads,
show confirmation link only after authorized reply/resolve and actual readback. -->

### ⚠️ Problems: {{problem_count}}

- [{{severity_emoji}} {{Severity}}] {{R-ID}} — {{title}} ({{OPEN | UNVERIFIED}})

<!-- If none say "Không có". PR/MR: link to verified posted inline/fallback
discussion or say "chưa đăng", giving unpublished details in preview.
Evidenced nonblocking Low findings can remain with Ready. -->

<!-- LOCAL ONLY: include Detail. PR/MR summary ends after Problems. Each detail
is separately previewed and published only after action-specific user consent. -->

### 📝 Detail

#### [{{severity_emoji}} {{Severity}}] {{R-ID}} — {{title}}

- **📄 File:** {{verified path:line, source side or document section/page}}
- **🔎 Lý do:** {{concrete evidence, reachable trigger and impact; or UNVERIFIED gap}}
- **🛠️ Đề xuất chỉnh sửa:** {{practical remediation}}
- **🧪 Cách kiểm tra:** {{proposed test and expected result; never imply it passed}}
