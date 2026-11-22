# Code Structure, Naming, SOLID, and Clean Code

Read sections relevant to a design decision. Project and language conventions decide syntax and layout; these are heuristics, not requirements for object-oriented architecture.

## 1. Names and contracts

- Use consistent domain vocabulary. Name files/modules for their responsibility, values for their meaning, functions for their action, and types for their concept or role. Prefer searchable names over broad `utils`/`manager` labels.
- Make ambiguity costly to miss: distinguish units, currency, timezone, tenant/owner, and lifecycle where confusion is plausible (`timeoutMs`, `amountMinorUnits`). Keep conventional short names only in small, obvious scopes. Use plural collection names and clear predicates.
- Preserve public wire names, framework discovery names, generated contracts, namespace/path case, and established idioms. For unsettled PHP/JS/TS casing, consult [Naming](naming-conventions.md).
- Names must match mutation, I/O, failure, and ordering behavior. A query-looking name must not hide a business write. Update dependent callers, imports, registrations, and docs when renaming; check dynamic consumers before removing apparently dead symbols.

## 2. Cohesion and readable control flow

- Keep one cohesive purpose at a consistent abstraction level. A use-case function can orchestrate several steps; one purpose does not mean one statement or one method. Use guard clauses or helpers when they clarify intent, not to meet line limits.
- Keep required inputs and defaults explicit. Replace ambiguous positional parameters/behavior flags with separate operations or a cohesive options object when call sites become unclear; do not mechanically wrap every argument list.
- Own invariants and related state together. Initialize valid state, keep visibility narrow, and avoid exposing mutable internals or surprising mutation of caller-owned values. Make resource ownership, initialization order, transactions, and cleanup explicit.
- Separate domain policy from transport, persistence, rendering, and delivery where ownership or lifecycle warrants it. Avoid both mega-modules and trivial forwarding layers. Inject dependencies at useful seams; avoid hidden mutable globals and service locators.
- Share an abstraction when code represents the same rule and must change together. Similar syntax with different invariants can remain separate. Solve demonstrated variation rather than hypothetical future features.
- Comments explain rationale, constraints, compatibility, or non-obvious algorithms. Keep them current; do not narrate obvious code. Preserve diagnostics and failure semantics instead of swallowing errors or manufacturing success.
- Keep changes focused and use existing formatters. A command may return a created resource or useful result; do not add an extra read and race merely to force strict command/query separation.

## 3. SOLID when change pressure warrants it

| Principle | Decision criterion | Common overreach |
|---|---|---|
| Single Responsibility | Split when unrelated policy owners/change reasons collide or state/testing becomes incoherent. | One class per statement or method. |
| Open/Closed | Add an extension point for demonstrated recurring variation while protecting stable behavior. | Predicting every provider or forbidding fixes to existing code. |
| Liskov Substitution | Implementations honor the same accepted inputs, guarantees, errors, invariants, and side effects. Prefer composition or another contract when they cannot. | Assuming matching signatures establish substitutability. |
| Interface Segregation | Expose capabilities each consumer needs when this reduces real coupling. | Splitting every operation into its own interface. |
| Dependency Inversion | Separate high-level policy from volatile details at a stable boundary when replaceability or isolation helps. | An interface/factory around every stable direct call. |

Example: several payment providers with different delivery lifecycles can justify a focused gateway contract. Each must preserve accepted/pending/failed and retry guarantees. One stable local price calculation usually needs only a clear function. In React, a cohesive component or custom hook can separate ownership without importing class hierarchies.

## 4. Review the changed design

Apply the core skill's necessity/minimality check internally. Can a reader infer purpose, ownership, units, and side effects from names and call sites? Does each boundary protect its invariants? Does each new abstraction remove an evidenced coupling or duplication? Are stale comments, hidden ordering, or unintended public changes left behind? Verify behavior at the boundaries affected; structure alone does not establish correctness.
