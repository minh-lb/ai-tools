---
name: codebase-setup
description: "Setup or normalize a project codebase: restructure folders, install required dependencies, add baseline configs, and enable quality/test/CI gates with small, reviewable changes."
---

# Codebase Setup

Use this skill when the user asks to bootstrap a codebase, standardize architecture, or add missing project foundations (dependencies, configs, scripts, quality gates, CI, and developer workflow).

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## Reference Load Trigger

- Load `references/nextjs-baseline-structure.md` when restructuring paths/layers.
- Load `references/nextjs-baseline-dependencies.md` when selecting/installing packages.
- Load `references/nextjs-baseline-config.md` when generating/updating configs.
- Load `references/nextjs-baseline-verification.md` when building verification commands/checklist.
- Load `.agents/skills/tanstack-query/SKILL.md` when setting up client-side data fetching with `@tanstack/react-query`.

For Next.js App Router projects, this skill must comply with `nextjs-coding` as a mandatory architecture contract.

## Default invocation behavior

- Ignore missing `$ARGUMENTS`; run with full baseline behavior by default.
- If the user does not provide an explicit scope, treat the request as `full` baseline by default.
- `full` baseline includes: structure + dependencies + configs + scripts + CI + env + verify.
- Treat explicit invocation of this skill as approval for normal baseline setup operations within scope.
- Ask before destructive or potentially breaking operations (for example deleting/moving many existing modules, replacing an established stack, or changing public contracts).

## When to use

- New project is missing baseline structure/config.
- Existing project needs normalization to shared conventions.
- Team asks for "setup from scratch", "prepare production baseline", or "cleanup project foundation".

## When not to use

- Single-feature implementation that does not need repo-wide setup.
- Bugfixes isolated to one module/file.

## Safety and scope rules

- Follow `AGENT.MINIMAL_CHANGE`, `AGENT.SCOPED_READS`, `AGENT.UNRELATED_FILES`, `AGENT.SAFE_OPERATIONS`.
- Follow `AGENT.KEBAB_CASE_PATHS` for new folder/file names unless a tool/framework requires a fixed filename.
- Do not execute destructive or breaking changes without explicit user approval.
- Stage setup changes in small batches (structure -> dependencies -> config -> verify).
- Preserve public behavior unless the user explicitly requests breaking changes (`AGENT.CONTRACT_STABILITY`).
- For Next.js setup, enforce `nextjs-coding` guardrails:
  - no mixed `app/` and `src/app/`
  - no ad-hoc `features/`/`lib/` when target layers exist
  - no direct real API calls from page/component files

## Execution workflow

1. Profile:
- Detect stack/tools and snapshot `package.json`, configs, env files, and folder roots.
- Choose scope (`plan`, `run`, `verify`, `full`) with `full` as default.

2. Structure:
- Align to `nextjs-coding` architecture for Next.js repositories.
- Keep moves incremental and avoid unrelated churn.

3. Dependencies:
- Install only missing capabilities and document necessity per package.
- Keep existing stack choices when they already satisfy requirements.
- When client-side data fetching is in scope, install `@tanstack/react-query` v5 and `@tanstack/react-query-devtools`, wire `QueryClientProvider` at app root per `tanstack-query` skill, and confirm with the user before adding (approval required).

4. Config + services:
- Apply TypeScript/lint/test/build/env/path-alias baselines.
- For external APIs, configure `services/api-client.ts` and `EXTERNAL_API` source switch.
- Keep `.env.example` as canonical non-secret key list and keep local env files untracked.

5. Quality gates:
- Ensure scripts and CI cover lint, typecheck, tests, build, and E2E when configured.

6. Verify + report:
- Run focused checks then full checks.
- Report changed files, deps, scripts/config added, verification evidence, and remaining risks.

For detailed procedural guidance, load only what is needed:
- `references/nextjs-baseline-structure.md`
- `references/nextjs-baseline-dependencies.md`
- `references/nextjs-baseline-config.md`
- `references/nextjs-baseline-verification.md`

## Output contract

When using this skill, always provide:

1. Setup plan (batched and reviewable)
2. Exact dependency commands
3. Config files to add/change
4. Verification commands
5. Rollback notes for risky changes
6. Next.js compliance notes (only when target is Next.js), including confirmation that `app/providers.tsx` is created as a `'use client'` wrapper and imported into `app/layout.tsx`
7. TanStack Query wiring notes when `@tanstack/react-query` is installed: confirm `QueryClientProvider` is mounted in `app/providers.tsx`, devtools are added for dev only, and `tanstack-query` skill patterns are followed
8. API client baseline notes when external API setup is in scope
9. Env baseline notes (`.env.example` keys, local env policy, secret-safety checks)
