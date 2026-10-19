---
type: log
log_id: "2026-10-19-092500-fix-login-redirect"
project: "my-backend"
title: "Fix login redirect loop"
date: 2026-10-19
created: 2026-10-19T09:25:00+07:00
status: completed
result: success
category: bugfix
agent: "codex"
task_id: "AUTH-1234"
session_id: "example-session-1"
autonomous_decisions: true
tags:
  - ai-log
  - authentication
  - redirect
  - bugfix
components:
  - auth
  - middleware
files_changed:
  - src/middleware.ts
---

# Fix login redirect loop

> **Illustrative example only.** The observations below describe a hypothetical execution, not a test performed by this skill package.

## Problem
Anonymous requests to `/login` were redirected back to `/login`, producing a redirect loop. Expected: public login page renders while private routes redirect unauthenticated users.

## Investigation
1. **Observed:** an unauthenticated `GET /login` returned a redirect to `/login` instead of a page. Evidence: browser reproduction in the hypothetical task.
2. **Inspected:** `src/middleware.ts` and route matcher. Found redirect logic applied to all matched unauthenticated requests.
3. **Checked hypothesis:** `/login` matched the middleware and had no public-route exception. Reproduction and existing conditional support the root cause.
4. **Root cause:** public login route was sent through the same unauthenticated redirect branch as protected routes.

## Implementation
- Changed `src/middleware.ts` so the `!token` redirect runs only when a requested route is not public.
- **Before:** a tokenless request always redirected to `/login`, including `/login` itself.
- **After:** public login requests proceed; protected requests without a token still redirect.
- **Why it works:** removing the recursive redirect edge stops the loop without moving authorization checks to page components.

## Decisions
- **Decision:** preserve centralized route protection in middleware, adding a public-route exception.
  - **Owner / approval:** AI / autonomous (hypothetical).
  - **Reason:** existing middleware already governs authentication; a narrow fix preserves routing conventions.
  - **Alternative actually considered:** move checks into each page. Rejected due to duplicated routing rules.
  - **Impact:** other public routes must also be exempted if covered by the matcher.
  - **Evidence:** existing middleware code and reproduced loop in this illustrative task.

## Verification
- `GET /login` without token — **passed**: login page rendered without looping (hypothetical observation).
- `GET /dashboard` without token — **passed**: redirect to `/login` observed (hypothetical observation).
- Full unit-test suite — **not run**; no claim about the suite.

## Outcome
- **Status/result:** completed / success for the two observed acceptance checks in this illustrative run.
- **Remaining risks / follow-up:** verify all other public routes and expand automated test coverage.
- **Reusable lesson:** if middleware matches a public route, its authentication redirect logic must explicitly exempt that route.
