---
name: coding-rules
description: >-
  Mandatory coding rules for JavaScript, TypeScript, PHP, ReactJS (JS/TS),
  Laravel (PHP), Docker, and SQL. MUST be consulted and followed every
  time code, container config, or SQL is written, edited, generated, or
  reviewed — not just when the user asks for "best practices" explicitly.
  Treat as required conventions, not optional suggestions. Covers SOLID,
  general OOP practices (encapsulation, Tell-Don't-Ask, immutability,
  avoiding anemic models/primitive obsession/static state), and Clean
  Code as baseline rules for any class-based code, plus language- and
  framework-specific rules (naming, structure, state management,
  performance, security, testing, anti-patterns) for React, Laravel,
  Docker (image security, secrets), and SQL (injection, indexing, N+1,
  transactions, migrations).
---

# Coding Rules

Rules to enforce for: JS/TS, PHP, ReactJS, Laravel, Docker, SQL — plus language-agnostic SOLID, OOP, Clean Code. AI-facing only: apply directly, don't narrate this file's existence to the user.

## Severity

- **MUST/MUST NOT** = defect if violated. Fix it, or state explicitly you're leaving a known violation and why. Default level for "Anti-patterns"/"Security" sections and anything phrased with never/always/MUST.
- **SHOULD** = default; override only with a stated reason (legacy constraint, prototype, explicit user instruction).
- **MAY** = judgment call by project scale/existing pattern (e.g. Redux vs Context).

## Load rules

Don't preload files you won't use.

| Context | File |
|---|---|
| Design/structure, any language | `solid.md` |
| Class-based OOP (encapsulation, immutability, anemic models) | `oop.md` (with `solid.md`) |
| Naming, function shape, error handling, any language | `clean-code.md` |
| Plain JS/TS | `javascript-typescript.md` |
| React (components, hooks, state) | `reactjs.md` |
| Plain PHP | `php.md` |
| Laravel | `laravel.md` (with `php.md`) |
| Dockerfile/docker-compose | `docker.md` |
| Raw SQL, schema, migrations | `sql.md` (with `laravel.md` if Eloquent) |

Narrow syntax question → one file. Design/review/new-feature task → add `solid.md`/`clean-code.md`/`oop.md` as relevant. Apply rules in the output directly; don't write non-compliant code then mention the rule after. When reviewing, cite the specific rule + fix, not the full checklist.

## New code vs. existing code

**New (green-field):** apply rules at full strength. Shape genuinely-foreseeable variation as polymorphism/strategy from the start (OCP); don't speculatively over-abstract (YAGNI). Write tests alongside the code.

**Modifying existing code (default assumption unless told otherwise):**
1. Read surrounding code + tests first. No tests on that path → write a characterization test before changing behavior.
2. Prefer extension (new interface impl, new strategy-map entry, new optional param with safe default) over editing the working core path.
3. No drive-by rewrites — don't reformat/rename/restructure unrelated code inside a feature/fix diff. Unrelated violation spotted nearby → flag it separately, don't fold it in.
4. Preserve existing contracts (signatures, response shapes, DB column meaning) unless the task says otherwise. A previously-green test failing after your change = stop and investigate, not edit-to-pass.
5. Breaking change for external consumers (public API, shared export, DB column read elsewhere) → additive path preferred; if a break is required, say so explicitly.
6. Match surrounding style; MUST-level rules apply regardless of existing convention.
7. Risky change to live behavior (money/auth/data integrity) → consider additive-then-switch over editing the live path directly.

## Precedence

1. Existing codebase convention conflicting with a rule here → follow the existing convention, flag the conflict.
2. User explicitly requests something a rule forbids → comply, state which rule is relaxed and why.
3. Otherwise these rules are the default — apply without being asked.

## Done means

- No open MUST violations.
- Written to satisfy strict linting/type-checking by construction (proper types, no unused vars/dead code) — this skill only shapes how code is written; it does not execute any tool.
- New/changed business logic has a test, or you've told the user why not.
- No debug leftovers (`console.log`, `dd()`, `var_dump()`, commented-out code, TODO left unflagged).
