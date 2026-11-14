## 🔍 Review lần {{round}} - {{local YYYY/MM/DD HH:mm}}

✅ Resolved ({{resolved_count}}), ⚠️ Problems ({{problem_count}})

Ưu tiên: 🔴 High ({{high_count}}), 🟠 Medium ({{medium_count}}), 🟡 Low ({{low_count}})

<!-- Counts are unique finding IDs. Priority counts cover Problems only.
Severity emoji mapping: 🚨 Critical, 🔴 High, 🟠 Medium, 🟡 Low.
Always retain the text label alongside its emoji.
Add 🚨 Critical (n) when nonzero; never downgrade Critical to fit this line.
Problems includes OPEN and UNVERIFIED; label UNVERIFIED explicitly.
First review: round 1, Resolved 0; do not invent prior findings.
PR: actual zero Problems plus adequate evidence and unchanged head → submit
APPROVE with this summary body; simulated zero counts never qualify.
Remove all authoring comments and replace all placeholders before delivery. -->

---

### ✅ Resolved: {{resolved_count}}

- [{{severity_emoji}} {{Severity}}] {{R-ID}} — {{title}}. Xác minh: {{current source/check proving the fix}}.

<!-- If none, write “Không có.” Preserve previous IDs and severity.
PR re-review: reply to the original finding with verified fix evidence, resolve
that thread, verify state, and link the confirmation here. If platform writes
fail, state “fix verified; thread not resolved” rather than claiming success. -->

### ⚠️ Problems: {{problem_count}}

- [{{severity_emoji}} {{Severity}}] {{R-ID}} — {{title}} ({{OPEN | UNVERIFIED; explain missing evidence when unverified}})

<!-- PR: link each entry to its verified inline comment or prior thread.
If none, explicitly say so. UNVERIFIED is not a confirmed current defect. -->

<!-- LOCAL ONLY: include the Detail heading and sections below in local reports.
PR summary ends above: omit the Detail heading and all detail content. Publish
each detail as an inline comment and link it from Problems. If no valid anchor
or inline tool is available, mark the Problem detail as unposted and explain
the limitation; return the unposted detail in chat, not in the PR summary. -->

### 📝 Detail

#### [{{severity_emoji}} {{Severity}}] {{R-ID}} — {{title}}

<!-- File is required locally; omit on PR when the inline anchor provides the
exact location. Add 🔁 Tái hiện between Lý do and Đề xuất chỉnh sửa only when
minimal reproduction steps materially clarify the issue. Cách kiểm tra is a
proposed check with expected results, not a claim it has already passed. -->

- **📄 File:** {{verified path:line or document section/page; source side}}
- **🔎 Lý do:** {{dimension, evidence, trigger, impact; design mismatch: cite design requirement/location and code behavior; UNVERIFIED: missing evidence}}
- **🛠️ Đề xuất chỉnh sửa:** {{practical remediation; do not repeat verification steps here}}
- **🧪 Cách kiểm tra:** {{specific test/manual check and expected result; evidence needed if UNVERIFIED; distinguish proposed checks from actual results}}
