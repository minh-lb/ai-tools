# Lumin

Lumin installs a namespaced skill set so the host can apply those skills proactively based on context, even when the user does not explicitly call `/lumin:<skill>` or `$lumin:<skill>`.

## Explicit Surface

- Claude Code: `/lumin:<skill-name>`
- Codex: `$lumin:<skill-name>`

## Auto-Apply Rules

Prefer the following Lumin skills when the context matches:

- `lumin-bugfix`: when you need to investigate and fix a problem end-to-end
- `lumin-debugger`: when you need to trace data flow or logic flow without changing code yet
- `lumin-business-analyst`: when you need to analyze requirements or write an SRS
- `lumin-backend-testcase-writer`: when you need to write testcase documentation for an API, service, repository, or worker
- `lumin-domain-driven-design`: when you need to design a Laravel backend module using DDD
- `lumin-git-workflow`: when you need to commit, branch, merge, release, or resolve Git conflicts
- `lumin-review-code`: when the user asks for a backend code review

## Team Skills

Treat the following two skills as opt-in:

- `lumin-team-mini`
- `lumin-team-full`

Only use them when the user clearly asks for an agent-team workflow or explicitly invokes the corresponding surface.

## Priority

- If the user explicitly calls `/lumin:<skill>` or `$lumin:<skill>`, always prioritize that surface.
- If both a repo-native skill and a Lumin skill are applicable, prefer the repo-native skill when the repository already has a clear source of truth for that workflow.
- If the repository does not provide a corresponding skill, use the Lumin skill.
