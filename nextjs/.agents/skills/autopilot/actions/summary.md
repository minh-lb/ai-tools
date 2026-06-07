# Summary Action

## Prerequisites

- Implementation must be complete (code changes exist in the working tree). If no changes, inform the user there is nothing to summarize.

## Steps

Gather active spec goals plus `git status` and relevant `git diff`.

Output using the format defined in `AGENTS.md` Output Format section.

If the work changed user-facing UI, include a `Visual Acceptance` section whenever `docs/visual-acceptance.md` applied. List the design reference used, chosen screen type, chosen density tokens, justification for any density escalation, viewports checked, states checked, matched aspects, intentional deviations, and unverified risks.

Also check:
- No unrelated files in the diff (`AGENT.UNRELATED_FILES`).
- No secrets or `.env` values exposed.
- No unnecessary dependencies added.
- `npm run lint` passes (when configured).
- `npm run typecheck` passes (when configured).
- `npm run build` passes.
- No obvious N+1 queries (Prisma `findMany` inside loops).
- Architecture stays within `nextjs-coding` layer boundaries: no business logic in `app/**/page.tsx`, no direct API calls from components or pages, `EXTERNAL_API` switch only in `services/<name>.service.ts`, no Pages Router files mixed in, no features placed outside `containers/` or `components/`.
- Every `useMutation` call has one explicit cache strategy: `invalidateQueries`, `setQueryData`, or `onMutate`/`onError`/`onSettled` optimistic rollback.
- Server Action forms return `{ errors }` for field-level errors and use `useActionState` in the controller.
