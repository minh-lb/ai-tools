---
name: coding-rule
description: Use when implementing, debugging, or refactoring software, or making code naming and design decisions, including PHP, JavaScript, TypeScript, React, Next.js, Laravel, NestJS, and APIs.
metadata:
  author: Minh Luu
---

# Coding Rule

Make the smallest complete change that meets the request and preserves contracts. Follow user/repository rules; do not copy existing defects.

## Workflow

1. Inspect relevant code, callers, tests, versions, and safe commands; define behavior at affected boundaries.
2. Prefer existing solutions, standard library/platform, installed dependencies, then new code. Add abstractions or dependencies only for concrete need; check compatibility and maintenance.
3. Keep state, side effects, validation, authorization, errors, accessibility, and data integrity explicit at owning boundaries. Avoid speculative or unrelated edits.
4. Verify changed behavior and failure paths; broaden for security, persistence, concurrency, or compatibility impact. Review the diff; report exact results, skips, and risks. Compilation alone is not runtime evidence.

## Read on demand

Choose by decision, not file extension. Read only matching guidance:

- [Design and naming](references/design-and-naming.md); [PHP and JS/TS](references/languages.md)
- [React, Next.js, Laravel, NestJS](references/frameworks.md)
- [UI and browser-performance diagnosis/optimization](references/frontend-essentials.md)
- [Backend, API, database](references/backend-and-data.md); [Security](references/security-boundaries.md)
- [Testing and verification](references/testing-and-verification.md)

Unlisted stacks: apply core/surface guidance. Check authoritative docs for versioned APIs. Operations: verify target/effects; get authorization before shared/destructive actions. Standalone; no other skill/MCP/tool needed, and it grants no permissions.
