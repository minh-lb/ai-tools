# Coding Rules: JavaScript & TypeScript

> Any JS/TS code.

## 1. TypeScript over plain JS

- Default to TypeScript for new code unless the user explicitly wants plain JS.
- `strict: true` in `tsconfig.json` — never disable for convenience.
- Avoid `any`; use `unknown` + narrowing instead.
- `type` for unions/intersections/utilities; `interface` for extendable/mergeable object shapes (props, domain models).
- No `// @ts-ignore` — fix the root cause, or `// @ts-expect-error` with a comment if genuinely necessary.

## 2. Naming

- `camelCase` vars/functions, `PascalCase` classes/types/interfaces/components, `UPPER_SNAKE_CASE` true constants.
- Function names are verbs (`fetchUser`); booleans prefixed `is/has/can/should`.
- No ambiguous abbreviations (`usr`, `tmp`, `data2`) beyond accepted ones (`req`, `res`, `err`, loop `i`).

## 3. Structure & modules

- One responsibility per file/module — no catch-all `utils.ts`; split by domain.
- Named exports over default, except where the framework convention requires default (file-based routing, config files).
- Barrel files (`index.ts` re-export) sparingly — prone to circular deps, slows tree-shaking at scale.
- Folder structure: for a small app, grouping by type (`components/`, `hooks/`, `services/`) is fine. Once the app has several distinct domains/features, switch to grouping by feature/domain (`features/orders/{components,hooks,api}.ts`, `features/users/...`) instead of type — this keeps everything one feature needs close together and lets a feature be understood, changed, or removed without touching unrelated type-grouped folders. Don't force this restructure on a small app "for future-proofing" (YAGNI); do it when a type-based folder is visibly accumulating unrelated domains.

## 4. Async/await & error handling

- `async/await`, not nested `.then()` chains.
- Every `async` function needs an error path (try/catch, or caller handles rejection) — no unhandled rejections.
- No empty `catch (e) {}` — log or re-throw with context:
  ```ts
  try {
    await saveUser(user);
  } catch (err) {
    throw new Error(`Failed to save user ${user.id}: ${(err as Error).message}`);
  }
  ```
- Independent promises → `Promise.all`/`Promise.allSettled`, not sequential await.
- Domain errors → custom Error subclass, not plain strings/objects:
  ```ts
  class NotFoundError extends Error {
    constructor(entity: string, id: string | number) {
      super(`${entity} with id ${id} not found`);
      this.name = "NotFoundError";
    }
  }
  ```

## 5. Immutability & side effects

- `const` by default, `let` only when reassignment is needed, never `var`.
- Don't mutate a parameter/state array or object directly — copy first (`[...arr]`, `{...obj}`, `structuredClone`).
- Pure functions by default; isolate side effects (API, logging, DOM) in their own layer, not mixed into business logic.

## 6. Concurrency & performance

- No heavy synchronous loops blocking the main thread — chunk or offload to a Web Worker/worker thread.
- Debounce/throttle high-frequency events (scroll, resize, search input).
- Node: never `*Sync` functions (`fs.readFileSync`) in a request-handling path.

## 7. Testing

- Unit test pure logic with minimal mocking.
- Name tests "should [result] when [condition]".
- Coverage is a reference metric, not a goal — prioritize important branches/edge cases.

## 8. Code style consistency

Consistent formatting throughout a file/project. No unused imports/dead code left behind.

## 9. Security (browser & Node)

- MUST NEVER `eval()`/`Function()` on user-input-derived strings.
- MUST NEVER set `innerHTML`/`dangerouslySetInnerHTML` with unsanitized user input (XSS) — sanitize (e.g. DOMPurify) if raw HTML is unavoidable.
- MUST NEVER build a URL/shell command/file path by concatenating raw user input.
- MUST NOT commit secrets into source; never log them.
- MUST NOT log PII (email, phone, name, payment data) in plaintext.
- Floating promises MUST be explicit (`void somePromise()` or `.catch()`), never left unhandled.

## 10. Null-safety (TypeScript)

- Optional chaining (`?.`) + nullish coalescing (`??`) over manual `if (x && x.y)` or `||` for defaults (`||` wrongly falls through on `0`/`""`/`false`).
- Non-null assertion (`!`) sparingly, only with a stronger guarantee than the checker has — not to silence a legitimate error.
- `as any`/`as unknown as X` treated like `any` — avoid; if needed for an untyped library, isolate to one boundary function with a comment.

## 11. Debug leftovers

`console.log`, `console.debug`, `debugger`, commented-out code MUST NOT remain in shared-branch code — blocking issue in review. Use a real logger for anything that must persist — pass structured context as an object (`logger.info('order created', { orderId, status })`), not string-concatenated into the message; see `laravel.md`'s Observability section for the same principle plus correlation-ID/API-versioning rules.

## Anti-patterns to avoid

- Nested `.then()` callback hell → async/await.
- `==`/`!=` instead of `===`/`!==` (except deliberate `x == null`).
- Global mutable state (`window`/`globalThis` assignment).
- Scattered magic numbers/strings.
- Importing a whole library for one function (`lodash` vs `lodash/debounce`).
