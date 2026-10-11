# Task Drafting Examples

These examples are illustrative. Use only facts in the user's request or verified sources; do not copy the sample behavior into a real task.

## Example 1 — Clear request, no estimate or assignee requested

**User:** “Create a ticket: Add a CSV export action to the reports page. The export must reflect the filters currently applied and must not include records the signed-in user cannot access.”

**Preview**

```text
Target: Jira / Reports project
Title: Add filtered CSV export to reports

Description:
Add a CSV export action to the reports page. The export should reflect the filters currently applied and include only records the signed-in user is authorized to access.

Acceptance evidence:
- Exported rows match the active report filters.
- Exported rows respect the user's existing access permissions.

Will remain unset: assignee, priority, estimate
```

No language, estimate, assignee, or extra-section questions are needed. Before creating, show the actual project/list and complete preview, then wait for approval.

## Example 2 — Request is too vague to define a useful fix

**User:** “Create a task to fix export.”

Do not invent a report, format, failure, cause, or expected result. Ask a focused clarification, for example:

> Which export flow is affected, and what happens now versus what should happen? If the desired fix is not known yet, I can draft a discovery task instead.

After the user answers, summarize only the confirmed facts. Keep any unresolved root cause as an open question; do not turn an assumption into an acceptance criterion.
