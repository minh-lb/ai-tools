# Project Overview

## Description

Reusable instruction, workflow, and skill kit for Codex and Claude Code agents working on spec-first Next.js App Router projects. This repo is agent configuration, not a scaffolded app.

## Goals

- Keep startup context compact and deterministic.
- Route every task through one workflow.
- Keep shared rules, provider adapters, workflows, skills, actions, and templates separated.

## Tech Stack

- **Agents**: Codex, Claude Code.
- **Target apps**: Next.js App Router, React, TypeScript, Tailwind CSS v4, Prisma, Zod, Vitest when applicable.
- **Optional dependencies** (install as needed): `react-hook-form` (Rule 09 form patterns), `@tanstack/react-query` (client-side data fetching), `react-dom/useFormState` (React 18) or `react/useActionState` (React 19+).
- **Repo content**: Markdown instructions, YAML workflow metadata, reusable templates, shell setup.

## Main Areas

- **Root instructions**: `AGENTS.md` is the shared source of truth; `CLAUDE.md` is a thin Claude Code adapter.
- **Core docs**: `docs/` contains overview, coding standards, active feature state, and generated specs.
- **Workflows**: `.agents/workflows/` selects the task route and gates.
- **Skills**: `.agents/skills/` provides domain-specific instructions and templates loaded on demand.
