# Coding Rules: Clean Code

> Read with `solid.md` for the full rule set.

## Naming
- Name answers "what is it/does" with no extra comment needed. Bad: `$data`, `$temp`, `handleStuff()`. Good: `$pendingOrders`, `calculateShippingFee()`.
- One consistent word per concept codebase-wide (not `fetch`/`get`/`retrieve` for the same action in different places).
- Name must match actual behavior — `getUser()` that also logs and emails is a naming/design smell.

## Naming case conventions

Pick the case style by **what is being named**, not preference — and stay consistent within each context. Language/framework files (`javascript-typescript.md`, `php.md`, `laravel.md`, `reactjs.md`, `sql.md`, `api.md`) give the authoritative rule where one exists; this table is the cross-language default plus the cases those files don't cover.

| Style | Use for |
|---|---|
| `camelCase` | Variables, functions, methods, properties — the default for anything without a more specific rule below. |
| `PascalCase` | Classes, interfaces, types, enums, React/UI components; a filename that must match a class/component 1:1 (`OrderService.php`, `UserCard.tsx`). |
| `snake_case` | DB tables/columns (`sql.md`); JSON body/response keys only if the project's API convention picked snake_case over camelCase (`api.md`) — never mix both in one API. |
| `SCREAMING_SNAKE_CASE` | True constants (`MAX_LOGIN_ATTEMPTS`); **environment variables** (`DATABASE_URL`, `API_KEY`) — never dot-case or camelCase for env vars, since `.env` files, Docker, and CI tooling all expect this shape. |
| `kebab-case` | URL paths/route URIs (`/order-items`, `laravel.md`/`api.md`); CLI flags (`--dry-run`); HTML/CSS class names and custom element tags; npm/composer package names; **Docker image, container, and compose service names** (`order-service`, not `OrderService` or `order_service` — Docker image names disallow uppercase); **non-component file names in JS/TS** (`format-currency.ts`, `use-debounce.ts`) — switch to `PascalCase` only when the file's default export is a class/component matching that name exactly. |
| `Train-Case` | HTTP headers only (`Content-Type`, `X-Request-Id`, `Authorization`). Wire-format convention, not a code-naming one — don't use it for variables, files, or identifiers. |
| `dot.case` | Hierarchical keys where the dots represent real nesting: Laravel named routes (`orders.store`), config keys (`app.timezone`), permission strings (`orders.cancel`). Don't use it for an identifier that isn't actually a namespace path. |

## Functions/Methods
- Small, one thing, one abstraction level. Needing "// step 1", "// step 2" comments to segment a function is a split signal.
- Hard limits: body >~40 lines, cyclomatic complexity >~10 (>~9 branch points: if/else/case/&&/||/ternary/loop), or nesting >3 levels → MUST split/refactor.
- Parameters ≤3 ideal, hard cap 4 — group into an object/DTO beyond that:
  ```ts
  // Instead of createUser(name, email, age, address, phone)
  createUser(input: CreateUserInput)
  ```
- Avoid flag arguments (`save(bool $sendEmail)`) — split into two functions instead.
- No hidden side effects unguessable from the name (`isValid()` that silently logs to DB).
- Query/command separation: a function MUST NOT both return a value and mutate state unless the caller obviously expects both (`array.pop()`). Name should disambiguate.

## Comments
- Good naming should make most comments unnecessary; comments explain **why** (business reasoning, workaround), never **what** the code already says.
- Delete dead/commented-out code — use git history instead.
- Outdated comments are worse than none — update/remove when touching related code.

## Structure & complexity
- Nesting hard limit: 3 levels — early return/guard clause beyond that:
  ```ts
  // Instead of
  function process(order) {
    if (order) { if (order.isValid) { if (order.items.length > 0) { /* handle */ } } }
  }
  // Prefer
  function process(order) {
    if (!order || !order.isValid || order.items.length === 0) return;
    /* handle */
  }
  ```
- Magic numbers/strings → named constants (`MAX_LOGIN_ATTEMPTS = 5`).
- DRY, not dogmatic: don't merge two coincidentally-similar lines representing different business concepts that will evolve independently. Concrete signal: the same non-trivial logic duplicated 3+ times MUST be extracted.
- No negated boolean names (`isNotDisabled`, `!isInvalid`) — name positively (`isEnabled`).
- File >~300-400 lines → flag as a split signal (SRP, see `solid.md`).

## Error handling
- Keep try/catch at clear boundaries (I/O, external calls) — don't interleave it through main logic. Pure business logic assumes already-validated input.
- Don't silently return `null` to signal an error — throw with context, or use an explicit type (`Result<T, Error>`, TS discriminated union) when the error is a normal part of the flow.

## Testing discipline (every language/framework here)
- Deterministic: no real wall-clock time (mock the clock, not `sleep()`), no real network calls (mock them), no order-dependence/shared leftover state between tests.
- One behavior per test — several small named tests over one large multi-assertion test.
- Arrange-Act-Assert structure, not interleaved setup/assertions.
- Test public behavior/contract, not private implementation details.
- New/changed business logic MUST have a test covering the main success path + likely edge case (see "Done means" in `SKILL.md`).

## File/class organization
- Low cohesion (too many unrelated properties/methods) usually pairs with an SRP violation (`solid.md`).
- Group related code together (variables near first use, related functions adjacent) rather than alphabetical/creation order.

## Quick review checklist
1. Can you guess a function/variable's job from its name alone?
2. Does the case style (camelCase/PascalCase/snake_case/SCREAMING_SNAKE_CASE/kebab-case/Train-Case/dot.case) match what's being named, consistently?
3. Does it do exactly one thing at one abstraction level?
4. >~40 lines, complexity >~10, or 4+ params?
5. Nesting >3 levels fixable with an early return?
6. Magic numbers/strings needing a named constant?
7. Same non-trivial logic duplicated 3+ times, unextracted?
8. Negated boolean names to rephrase positively?
9. Comments still accurate, or stating the obvious?
10. Errors handled explicitly, or swallowed/returned as ambiguous `null`?
11. File/class past ~300-400 lines without clear reason?
