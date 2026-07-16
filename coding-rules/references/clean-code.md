# Coding Rules: Clean Code

> Read with `solid.md` for the full rule set.

## Naming
- Name answers "what is it/does" with no extra comment needed. Bad: `$data`, `$temp`, `handleStuff()`. Good: `$pendingOrders`, `calculateShippingFee()`.
- One consistent word per concept codebase-wide (not `fetch`/`get`/`retrieve` for the same action in different places).
- Name must match actual behavior — `getUser()` that also logs and emails is a naming/design smell.

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
2. Does it do exactly one thing at one abstraction level?
3. >~40 lines, complexity >~10, or 4+ params?
4. Nesting >3 levels fixable with an early return?
5. Magic numbers/strings needing a named constant?
6. Same non-trivial logic duplicated 3+ times, unextracted?
7. Negated boolean names to rephrase positively?
8. Comments still accurate, or stating the obvious?
9. Errors handled explicitly, or swallowed/returned as ambiguous `null`?
10. File/class past ~300-400 lines without clear reason?
