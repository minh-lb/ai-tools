---
name: task-creator
description: Draft and create a new backlog task, ticket, or issue in a task tracker or an explicitly requested local file. Use when the user asks to create, log, or file new work; do not trigger for ordinary implementation requests or updates to an existing task.
metadata:
  author: Minh Luu
---

# Task Creator

Create a clear, evidence-based task in the user's chosen tracker or, when explicitly requested, as a local Markdown file. Never infer task-creation intent from an ordinary request to implement or fix something.

## Safety and content rules

- Draft first. Before writing to a tracker or local file, show the complete task and exact destination, then wait for explicit approval. Approval applies only to the previewed title, description, project/list, and optional fields; if any changes, preview and obtain approval again.
- Use facts supplied by the user or verified in approved project sources. Do not invent root causes, acceptance criteria, environments, file scope, estimates, owners, due dates, or business impact. Mark consequential unknowns as open questions or ask when they block a useful and safe task.
- Keep the task concise and audience-appropriate. Include technical identifiers when they help implement or verify the work; do not force business-only wording or a fixed set of sections.
- Follow the target board's existing conventions and required fields. Avoid repeating the same rationale under multiple headings.
- Include an estimate only when requested. Present it as a provisional range or the project's normal estimate format, with assumptions and confidence; do not imply false precision.
- Never copy credentials, tokens, unnecessary personal data, or secrets into a task.

## Workflow

1. **Confirm the task is to be tracked.** Use the user's stated tracker or existing project convention when clear. Ask only if the destination or audience materially affects the record. If no suitable connector is available, explain that and offer a local file only when the user requests or approves that fallback.
2. **Gather only material context.** Extract the problem, desired outcome, acceptance evidence, known scope, dependencies, and references from the user and approved sources. Ask focused questions only for decisions that block a useful task; otherwise label assumptions and unresolved decisions without pretending they are facts.
3. **Draft.** Use the board's fields and writing convention. When free-form description is appropriate, a concise structure may include:
   - Context / problem
   - Desired outcome or acceptance criteria
   - Scope or non-goals, when known
   - References, when available
   - Open questions or assumptions, only when material

   Omit irrelevant sections instead of filling them with boilerplate such as `None` or `Not determined`.
4. **Estimate only on request.** Read `references/estimate_scale.md` when an estimate is requested. Base it on known work, team/project history, dependencies, review, and verification effort. State important assumptions and uncertainty; ask for missing information only when it would materially change the estimate. Do not infer effort from file counts or a universal hours table.
5. **Preview.** Use `references/task_template.md` as a flexible structure, not a required schema. Show the full title, description, target workspace/project/list, and every optional field that will be written. Clearly identify any open questions and whether the task will remain unassigned. Ask for explicit approval before proceeding.
6. **Assignment and other fields.** Use an assignee, priority, label, or due date only when the user supplies it or the target requires it. Ask only for a required missing value; otherwise leave it unset. If the user requests a specific assignee and a member lookup is available, use it to disambiguate rather than guessing.
7. **Create once approved.**
   - **Tracker:** Use the connected tool for the approved platform and exact project/list. Check for a likely duplicate when search is available and relevant. If a create call has an ambiguous timeout or response, search/reconcile before retrying so a successful first write is not duplicated. Surface validation/authentication failures accurately; do not silently drop fields or retry blindly.
   - **Local file:** Write only when the user has chosen/approved this fallback. Resolve `docs/tasks/` from the project root, verify the resolved destination and existing parents remain inside that root, and refuse symlink escapes. Follow an existing naming scheme; if using sequential IDs, inspect existing IDs once, choose an unused ID, and refuse to overwrite any existing file. Create directories only after approval.
   - **Batch:** Preview the full batch first. Create items one at a time and verify each result. If a write fails or its result is ambiguous, stop and report which items were created; do not repeat an uncertain write.
8. **Report.** Return the created task link/ID or local path, plus any remaining blockers. Do not claim creation succeeded without a verified result.

## Scope

This skill creates new tasks only. For editing, closing, reassigning, or changing an existing task, use the target platform's supported workflow and its authorization rules.
