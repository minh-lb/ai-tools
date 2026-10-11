---
name: coding-rule
description: Language- and framework-agnostic coding guidance for implementing, editing, debugging, and refactoring software, including application code, APIs, databases, UI, security, infrastructure as code, containers, and shell scripts.
metadata:
  author: Minh Luu
---

# Coding Rule

Produce correct, secure, understandable, maintainable code—not maximum abstraction or minimum line count. Apply this skill across languages and platforms without imposing one syntax, naming case, framework, or architecture.

## Scope and precedence

1. Follow explicit user intent, approved contracts, and applicable safety, privacy, and security requirements.
2. Inspect the target repository's instructions, conventions, architecture, supported versions, existing code, dependencies, and verification commands.
3. Use current technology documentation where implementation details depend on a version or platform.
4. Use this skill's defaults only where the preceding sources leave room for judgment.

Do not copy an existing defect. Ask a focused question only when a missing decision blocks a safe, correct implementation.

## Workflow

1. Identify the intended outcome, acceptance conditions, affected surfaces, contracts, trust boundaries, state changes, and compatibility concerns.
2. Inspect relevant code, callers, tests, configuration, dependencies, and safe project checks.
3. Apply the necessity/minimality gate below internally, using repository evidence.
4. Make the smallest complete change while preserving the safeguards and contracts that apply.
5. Run relevant, safe checks; review the final changes and report exact results and limits. Never claim an unrun check passed.

## Mandatory necessity and minimality gate

Apply to every behavior-affecting implementation change, including bug fixes; also apply when a behavior-preserving refactor adds meaningful structure. Scale investigation to risk. Purely mechanical formatting or comment-only edits may skip irrelevant checks.

This is an internal AI checklist, not a questionnaire for the user. Inspect the codebase and platform; ask the user only if a blocking requirement or decision remains unresolved.

1. **Need:** Is this required by the stated outcome, defect, or safety requirement? Avoid unrequested extras and speculative flexibility; do not second-guess a clearly requested outcome.
2. **Existing solution:** Does the codebase already implement it? Search relevant modules, call sites, contracts, and tests; reuse only if it fits correctly.
3. **Standard library:** Can the supported language's standard library handle it without custom machinery?
4. **Native feature:** Can a built-in platform, runtime, database, browser, or framework feature handle it? Check this separately from the standard library.
5. **Installed dependency:** Does a suitable dependency already exist? Avoid duplicates. Justify a new dependency against security, maintenance, license, compatibility, and runtime costs.
6. **Direct call:** Would one clear call or line fully meet the contract? Avoid forwarding wrappers, but do not compress away meaning or safety.
7. **Minimum complete solution:** What is the smallest cohesive implementation that handles applicable boundaries and failures, preserves contracts, and has appropriate tests/docs?

For material changes to public behavior, security, persisted data, or compatibility, record the rationale and unresolved assumptions.

## Non-negotiable safeguards

**Never cut applicable validation, error handling, security, or accessibility to save code or dependencies.** Simplicity removes unnecessary machinery; it does not weaken assurance. Keep validation at the correct trust boundary; do not replace meaningful error handling with swallowed failures or false success; preserve security controls; and retain applicable UI semantics, keyboard/focus, labels, and status/error behavior. Remove a seemingly redundant control only after verifying an equivalent control at the correct boundary. Preserve data integrity and compatibility as well.

## Core design baseline

- Implement the actual contract; keep invariants, ownership, compatibility, and side effects clear. Use descriptive domain names and target-language/project idioms.
- Reuse suitable existing/native capabilities; avoid speculative layers, duplicate rules, dead code, and hidden shared state.
- Document consequential behavior. Follow project-specific test policy and evidence; do not impose universal line/file sizes, coverage percentages, or test counts.

## Load only relevant guidance

Use this entry skill for every coding task. Load only the reference sections that match the changed surface; do not read the whole reference library by default. The detailed code-structure reference is conditional, not required for every small code edit. The [standards and research basis](references/standards-basis.md) is an optional source index, not required to implement the rules.

| Work in scope | Load relevant guidance |
|---|---|
| Nontrivial naming, function/type/class/module design, SOLID, or structural refactoring | [Code structure and Clean Code](references/code-structure-and-clean-code.md): read only the relevant numbered section(s); read SOLID only when evaluating abstractions or inheritance. |
| Browser, mobile, desktop, or other user interface | [Frontend](references/frontend.md); add [Frontend performance](references/frontend-performance.md) only when performance is affected. |
| Service, worker, job, or server-side logic | [Backend](references/backend.md); add [API and REST](references/api-and-rest.md) for API contracts, and its REST section only for resource-oriented HTTP. |
| SQL, persistence, schema, or migration | [Database and SQL](references/database-sql.md); add relevant [Security](references/security.md) sections for trust or access-control boundaries. |
| Authentication, authorization, untrusted input/output, files, network calls, secrets, or sensitive data | Relevant sections of [Security](references/security.md). |
| Tests or verification strategy | Relevant sections of [Testing and quality](references/testing-and-quality.md). |
| Infrastructure as code, Docker/Compose, deployment, configuration, runtime operations, or Bash/POSIX shell | Relevant sections of [Reliability and operations](references/reliability-and-operations.md); add Security for secrets, permissions, or network exposure. |

For cross-layer changes, load guidance for each affected surface. A client-side check does not establish server-side authorization; a successful response does not prove persisted state is correct.
