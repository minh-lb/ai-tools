# Coding Rules: Object-Oriented Programming (general practices)

> Complements `solid.md` (SOLID specifically) and `clean-code.md` (naming/function shape). Any class-based code.

## 1. Encapsulation

- Fields private/protected by default — public mutable properties let callers put the object into an invalid state.
- Avoid **anemic domain model** (data-bag classes with all logic in external `*Service`/`*Manager`). Behavior operating only on one object's own data belongs on that object:
  ```php
  // Anemic
  if ($order->getStatus() === 'pending' && $order->getTotal() > 0) { $order->setStatus('confirmed'); }
  // Encapsulated
  $order->confirm(); // enforces its own invariant internally
  ```
- Constructors MUST validate invariants and fail fast — never allow construction into a known-invalid state.
- Getters MUST NOT return a direct reference to an internal mutable collection/object — return a copy, read-only view, or value object.

## 2. Tell, Don't Ask

Tell an object to act (method encapsulating decision + mutation), don't ask its state via getters and decide externally — the latter signals leaked logic (often anemic-model symptom).

```ts
// Ask
if (cart.getItems().length === 0) { throw new Error("empty cart"); }
// Tell
cart.checkout(); // enforces the rule itself
```

## 3. Immutability for value-like data

Money, date ranges, addresses, coordinates → immutable Value Objects (fields never change post-construction; "modification" returns a new instance). Matters most across boundaries (queued Job payload, async callback, cache) where mutable shared state causes hard-to-reproduce bugs.

## 4. Avoid primitive obsession

Don't pass a domain concept as loose primitives (raw `float` + separate currency `string`; unvalidated email `string`). Wrap in a self-validating Value Object where domain rules would otherwise be duplicated at every use site:

```php
final class Money
{
    public function __construct(private readonly int $amountInCents, private readonly string $currency) {}
    public function add(Money $other): self { /* validates same currency, returns new Money */ }
}
```

## 5. Polymorphism over type-checking conditionals

MUST NOT branch on runtime type or a discriminator field (`instanceof`, `typeof`, `type: 'card'|'paypal'` switch) when the decision recurs in multiple places — OCP violation (`solid.md`); fix is interface + polymorphic dispatch or a strategy map.

## 6. Null handling

- Return an empty collection, not `null`, when "nothing found" is a normal list-method outcome.
- Consider Null Object (no-op implementation of the interface) over scattered `if ($x !== null)` checks for an optional collaborator.
- Distinguish "genuinely absent, caller must handle it" (explicit nullable type at the boundary) from "accidentally uninitialized" (a bug a constructor invariant should prevent, per section 1).

## 7. Avoid static/global mutable state

`static` mutable state is a hidden global — makes tests order-dependent, concurrency hard to reason about. Avoid except for true constants/controlled registries. Prefer a DI-managed singleton (framework container) over hand-rolled `getInstance()` — same effective behavior, but mockable/replaceable in tests.

## 8. Interfaces vs. abstract classes

Interface for a pure contract. Abstract class only when subclasses genuinely share non-trivial implementation — keep it shallow (composition-over-inheritance limit in `solid.md`); don't inherit just to share a couple of utility methods.

## 9. Value equality

Value Objects: equality by value, not reference. PHP: explicit `equals()` method, not `==`/`===`. TypeScript: compare fields explicitly/via helper — `===` on same-shape object literals is never `true` by value.

## 10. Encapsulate collections

Don't expose a raw mutable array/list as a public property callers can push into directly, bypassing business rules (max items, duplicates, status). Provide a method (`addItem()`) enforcing the rule; expose the collection read-only or as a copy.

## Quick review checklist

1. Public mutable fields?
2. `*Service`/`*Manager` deciding via another object's getters instead of that object's own method? (anemic/Tell-Don't-Ask)
3. Constructor allows an invalid object without throwing?
4. Getter returns a direct reference to internal mutable state?
5. Domain data (money, email, date range) as loose primitives with logic duplicated per use site?
6. `instanceof`/`typeof`/type-field branching that should be polymorphism?
7. `null` overloaded for both "expected empty" and "accidental missing state"?
8. Mutable `static` state or hand-rolled Singleton instead of DI-managed instance?
9. Inheritance used just to share a couple of methods, where composition would be shallower?
