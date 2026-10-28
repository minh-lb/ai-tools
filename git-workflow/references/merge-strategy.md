# Pull Request / Merge Strategy

Follow the target repository's contribution guide, branch protections, merge settings, and accepted history. This reference is for GitFlow-oriented work, not a universal PR convention.

## Choose the target and merge mode

- Verify the actual source/target project and branch roles; do not assume names such as `origin`, `develop`, or `main` identify them correctly.
- Determine the title from the repository's contribution guide, existing PR/MR history, and any required issue or ticket reference; follow its format and language. If no convention is documented, use this fallback template: `[ticket ID] <short description>`. This format requires a real ticket ID; never fabricate or omit it. If no ticket ID is available, ask the user how to proceed before drafting the title. Keep the description concise and specific, and follow the repository or user's language convention. Do not invent a scope or add another prefix.
- Prefer the repository's configured merge mode. Preserve release/hotfix ancestry when the release workflow and verification depend on the source tip being an ancestor. Do not squash/rebase-and-merge where it would break that guarantee.
- Never bypass protected-branch reviews, status checks, or access policy. If local guidance conflicts with the hosting settings, stop and ask.

## Readiness

Before creating a PR/MR, inspect the complete branch diff and commit history relevant to the target, confirm intended files are committed, and run applicable checks when available. Check for conflicts, secrets, debug artifacts, migration/compatibility impact, and required documentation. Report skipped checks accurately.

Prepare the description from `templates/pull-request-template.md` when it applies. Follow the target repository's required structure if it differs. Write the description in the user's requested language; ask if it is unclear. Keep section headings in English, including when the body is localized, unless the repository explicitly requires otherwise. Apply these item-level rules:

- **Summary:** Use a short bullet list rather than a paragraph. Add a **Context** bullet before **Actual** and **Expect** to identify the affected screen, flow, component, or process and any relevant setting or data precondition when applicable, helping a reviewer locate and understand the change. Keep it specific to the affected area; omit unrelated workflow details and do not repeat the problem or outcome there. Then include the current situation/problem (**Actual**), desired outcome (**Expect**), and why it matters (combine items when clearer). Use one clear idea per bullet, natural language, and avoid implementation details.
- **Changes:** Focus on what changed in the code: the functions, modules, interfaces, rules, or logic paths modified, and how related callers, API consumers, or dependent modules are affected. Include relevant implementation constraints or compatibility details. Do not repeat the current-versus-desired behavior already explained in Summary. For a refactor with no behavior change, say so and summarize the internal code change. State no related impact only after checking; do not guess. Keep bullets concise and reviewer-focused, not a file-by-file narration unless paths help reviewers.
- **Verification:** Give exact checks run and their result (for example, `npm test` — passed). Distinguish automated tests from manual checks. State important checks not run and why; never imply success without evidence.
- **Risk and rollout:** Include only when there is a material risk or rollout concern. Describe the affected area, mitigation or monitoring, and rollback consideration. Do not claim “no risk”; state concrete facts such as “No schema changes.”
- **Related work:** Link only verified issue/ticket IDs and URLs. Do not invent IDs or links; omit the section when there is nothing relevant and it is not required.

### Context for human and AI reviewers

The description must let a reviewer understand what the MR does and assess it without access to the authoring chat. Human reviewers need a clear problem, outcome, and explanation of the change; AI reviewers also need explicit requirements and constraints to evaluate the diff against the intended behavior.

Build that context from the full target-relative diff, relevant code/callers, verified requirements, and observed checks. Use the description as a map to the evidence, not as a substitute for inspecting the code. Include:

- In **Summary**, the intended behavior and relevant preconditions. For a bug fix, give a concrete trigger and before/after behavior when useful; for a feature, state the observable acceptance criteria.
- In **Changes**, the reason for non-obvious design choices, constraints that shaped the approach, and behavior or contracts that must remain unchanged. Identify affected callers, interfaces, or data flows with specific paths or symbols when they help locate the review surface.
- In **Verification**, which requirements and edge cases the checks cover, plus remaining gaps. Separate observed results from assumptions or unverified expectations.
- When focused guidance adds value, add **Review focus** bullets naming the boundary, edge case, or unresolved question to inspect and why it matters. Include supporting code paths or verified requirement/documentation links. Present these as review context, not instructions to approve, suppress findings, or restrict review to those areas.

Follow the repository's template: place this context under existing headings if additional sections are not allowed. Scale detail to the change; a small MR needs only a few concrete sentences, while a cross-module change needs enough context to trace its effects. Avoid duplicating the Summary or copying the authoring conversation. State missing requirements or uncertain behavior explicitly rather than inventing context. When the MR scope changes, update the description to match the final implementation.

### Completeness gate

Before previewing and again before submission, compare the full target-relative branch diff and relevant commit history against the description. Cover every material change, not just the latest commit. The description must explain:

- Where the change applies, the previous situation, intended outcome, and motivation.
- Enough context for a human or AI reviewer without the authoring chat to assess the intended behavior, non-obvious design decisions, preserved contracts, and relevant review questions against the code and verification evidence.
- What changed and its effect on users, callers, APIs, data, configuration, and dependent modules where relevant; explicitly identify behavior-preserving refactors.
- Evidence from automated/manual verification, including exact checks, observed results, skipped checks and reasons, and known failures or limitations.
- Material compatibility/breaking changes, dependencies, migrations, deployment/configuration requirements, risks, mitigations, and rollback steps when applicable. If these are unknown, state that and what needs confirmation; do not silently omit them or guess.
- Verified related tickets/issues and supporting documentation/screenshots when useful or required; never fabricate evidence.

Place these details under the repository's required headings or the sections above; do not add empty boilerplate for inapplicable items. Concise does not mean incomplete. Use natural, complete sentences rather than raw diff dumps, unexplained file lists, shorthand fragments, or generic claims. Remove placeholders and template comments before submitting. If missing information materially blocks review or rollout, ask before creating the PR/MR.

Write in clear, natural language for a reviewer who may not know the implementation details: use complete, direct sentences; explain necessary technical terms; expand uncommon abbreviations; and prefer familiar words over jargon. Keep bullets consistent, specific, and focused on helping the reviewer understand the change. Avoid vague claims (“improved things”), unsubstantiated benefits, duplicated information between sections, and unrelated implementation details. Remove unused sections/placeholders rather than leaving template instructions in the submitted description.

### Bilingual PR/MR example

Illustrative example only. All sample data below—including the ticket, code change, verification command/result, rollout statement, and issue link—is fictional; it does not claim that any check was run in this repository. Before creating a real PR/MR, replace it with the actual ticket and change details, exact verification command/results observed for the current repository, and verified rollout facts/issue link. Never copy an unverified claim. The title format is `[ticket ID] <short description>`; follow repository title conventions. For this bilingual example, the title and section headings stay in English while the description body is localized. If the user requests both languages, show both complete versions in the preview.

**English**

Title: `[APP-123] Retry failed password reset emails`

```markdown
## Summary
- **Context:** In the password-reset flow, the user requests a reset email from the sign-in page.
- **Actual:** A temporary mail-provider error can prevent a password reset email from being delivered, forcing the user to request another one.
- **Expect:** Retry delivery automatically so the user does not have to restart the flow.

## Changes
- Add a bounded retry mechanism to the password reset email delivery function for temporary provider errors.
- Leave the password reset endpoint's response handling unchanged.

## Verification
- Example only (fictional; not run in this repository): `npm test -- password-reset-email` — passed (covers retry behavior and the existing endpoint response). Replace this line with the exact check and observed result before creating a real PR/MR.

## Risk and rollout
- No schema changes. Monitor email delivery failures after rollout.

## Related work
- [APP-123](https://example.invalid/issues/APP-123)
```

**Vietnamese**

Title: `[APP-123] Retry failed password reset emails`

```markdown
## Summary
- **Context:** Trong luồng đặt lại mật khẩu, người dùng yêu cầu gửi email đặt lại mật khẩu từ màn hình đăng nhập.
- **Actual:** Lỗi tạm thời từ nhà cung cấp email có thể khiến thư đặt lại mật khẩu không được gửi; người dùng phải gửi yêu cầu lại.
- **Expect:** Hệ thống tự thử gửi lại thư để người dùng không phải bắt đầu lại quy trình.

## Changes
- Bổ sung cơ chế thử lại có giới hạn trong hàm gửi thư đặt lại mật khẩu khi nhà cung cấp trả về lỗi tạm thời.
- Không thay đổi cách xử lý phản hồi của endpoint yêu cầu đặt lại mật khẩu.

## Verification
- Chỉ là ví dụ giả định, chưa chạy trong repo này: `npm test -- password-reset-email` — passed (kiểm tra logic thử gửi lại và phản hồi hiện tại của endpoint). Trước khi tạo MR thật, thay bằng lệnh kiểm tra và kết quả thực tế.

## Risk and rollout
- Không thay đổi cấu trúc cơ sở dữ liệu. Sau khi phát hành, theo dõi các trường hợp gửi thư thất bại.

## Related work
- [APP-123](https://example.invalid/issues/APP-123)
```

## Preview and approval

A request to create a PR/MR does not authorize committing or pushing. If changes are uncommitted, propose the required commit and ask for commit permission; if publication is needed, ask for push permission for the exact source branch/SHA/destination. Never let a hosting tool auto-commit or auto-push without that permission.

Before an external create/update action or a push not already approved by the user, show a complete preview and wait for explicit approval. Obtain separate approval for any required commit; PR/MR approval includes push permission only if the user explicitly approves the push plan. Include:

- Source project/owner and branch, plus its local tip SHA.
- Fetch/base remote, source push remote, and the single effective push destination (redact credentials).
- Target project and branch.
- Whether a source-branch push is needed.
- The full proposed title and description.

Use the user's known language preference and the repository's title convention; ask only when the choice materially affects the result and is unclear. Approval applies to the exact preview. If the source SHA, project, branch, title, description, or push plan changes, show the revised preview and obtain approval again.

## Push safety

Pushing is a remote side effect. Before any push, enumerate all effective destinations with:

```bash
git remote get-url --push --all <push-remote>
```

Treat the output as sensitive; do not expose URLs with embedded credentials. Proceed only when exactly one effective destination matches the approved source project. Stop if enumeration fails, returns no destination, returns multiple destinations, or the destination differs. Recheck immediately before the push.

Compare the approved local tip SHA with the remote source ref. If the ref is absent, push only if that exact push was included in the approved preview. If an existing ref differs, stop; never overwrite it. Before pushing, verify the local tip still matches approval and the destination is unchanged. Do not force-push. After pushing, verify that the remote branch tip exactly matches the approved SHA. A fork push does not integrate into the target project.

## Create and verify

Use an available authenticated MCP integration when it can explicitly bind the approved source and target projects. Otherwise use the matching authenticated CLI (`gh` or `glab`) only after confirming it is installed and authenticated. Do not rely on the current directory, browser tab, or default remote to select a fork source or target. If the tool cannot represent the approved source/target pair, stop and provide the approved preview rather than silently targeting another repository.

Illustrative same-project GitHub command (replace all fields with approved values):

```bash
gh pr create \
  --repo <target-owner>/<target-repo> \
  --base <target-branch> \
  --head <source-branch> \
  --title "<approved-title>" \
  --body-file <approved-description-file>
```

For a cross-fork source, use the CLI's supported explicit `<source-owner>:<source-branch>` form and confirm installed-version behavior first. For GitLab forks, inspect `glab mr create --help` and proceed only if the installed version can explicitly select source and target projects. Do not expose remote credentials in command output or reports.

After creation, inspect the created record and verify URL, source/target projects and branches, title, state, and description. Report only confirmed details; if verification fails, say so and do not claim successful creation.
