# Init Project

Goal: write concise project context to `docs/project-overview.md`.

1. Use loaded `docs/project-overview.md`; read the file only if it is unavailable in context.
2. If the file has meaningful content, ask before overwriting.
3. Use `$ARGUMENTS` first; ask only for missing essentials: name, description, tech stack, goals, users, modules.
4. Write this shape:

```markdown
# Project Overview

## Description
{1-2 sentences}

## Goals
- {goal}

## Tech Stack
- Frontend: {value}
- Backend: {value}
- Database: {value}
- Other: {value}

## Users
{target users}

## Modules
- {Module}: {purpose}
```

5. Show the result and ask if changes are needed.
