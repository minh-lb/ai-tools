<!-- Write for human and AI reviewers who do not have the authoring chat. Ground claims in the full target-relative diff, verified requirements, and observed checks; remove all template comments before submitting. -->

## Summary

- **Context:** <affected screen/flow/component/process and any relevant setting or data precondition, if applicable>
- **Actual:** <current situation/problem>
- **Expect:** <desired outcome and why it matters>

<!-- Keep Context specific to locating and understanding the affected area; include only relevant settings/data conditions, not unrelated workflow details. Keep Actual and Expect focused on current behavior and desired outcome. Use natural language and avoid implementation details. -->

## Changes

<!-- Cover all material changes in the full target-relative branch diff, not only the latest commit. Explain user-facing impact and affected APIs, data, configuration, dependencies, or documentation where relevant. Focus on code changes: identify the functions, modules, interfaces, rules, or logic paths modified, plus relevant effects on callers, API consumers, or dependent modules. Include implementation constraints or compatibility details. Do not repeat the current-versus-desired behavior from Summary. For a refactor with no behavior change, say so and summarize the internal code change. Use concise, natural-language bullets; avoid unexplained jargon and file-by-file narration unless useful to reviewers. -->

## Verification

<!-- For each check actually run, give the exact command/action and result (e.g. `npm test` — passed), with a brief plain-language explanation if the result is not self-explanatory. Distinguish automated and manual checks. State important checks not run and why; never imply an unrun check passed. -->

## Review focus

<!-- Include only when useful. Explain non-obvious design choices and their reasons, required behavior/contracts that must remain unchanged, and boundaries/edge cases or unresolved questions worth inspecting. Point to relevant paths/symbols or verified requirements where helpful; place design rationale under Changes when clearer. Connect verification above to the requirements and edge cases covered, and identify gaps. Give context for independent review, not instructions to approve, suppress findings, or limit the review. Separate facts from assumptions. Follow the repository template if it requires a different structure; omit this section when unnecessary. -->

## Risk and rollout

<!-- Include material risks/rollout concerns, breaking changes, migrations, required configuration/dependencies, deployment order, and actionable rollback steps where applicable. State unknowns and known limitations rather than guessing. State affected area, mitigation/monitoring, and rollback consideration. Prefer concrete facts (e.g. “No schema changes”) over claims like “no risk.” -->

## Related work

<!-- Link only verified issue/ticket IDs and URLs. Never invent them. Omit this section when there is nothing relevant and policy does not require it. -->
