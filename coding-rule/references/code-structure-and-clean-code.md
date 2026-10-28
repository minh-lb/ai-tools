# Code Structure, Naming, SOLID, and Clean Code

Load this reference for nontrivial naming, function/type/class/module design, SOLID, or structural-refactoring decisions. For a small local edit with no such design question, the core [Coding Rule](../SKILL.md) is sufficient. These rules are language-agnostic; the target language's official style guide and repository conventions decide syntax, casing, file layout, and idioms. Do not turn heuristics into numeric limits or mandatory object-oriented design.

## 1. Names: make intent searchable and unambiguous

A name should let a reader understand what the value represents, what an operation does, or what a type owns without reverse-engineering its implementation. Prefer precise domain vocabulary used consistently in the codebase.

### Files, directories, and modules

- Name a file for its primary concept or responsibility, not its implementation accident. Prefer a recognizable domain/feature term over vague names such as `misc`, `stuff`, `helpers2`, or unexplained `common`.
- Keep file and directory names consistent with the project's casing, separators, pluralization, and module layout. Do not impose one universal `kebab-case`, `snake_case`, or one-file-per-class rule.
- Make the path help a reader find the owner of behavior. Organize by cohesive feature/domain boundaries where that is the repository's model; avoid both mega-files and needless fragmentation.
- Keep filenames distinct enough to search reliably. Avoid near-duplicate names whose only distinction is an unexplained suffix, number, or abbreviation.
- Rename or move files only when required for the change; update imports, manifests, generated references, and documentation through the project's supported refactoring workflow.

### Variables, fields, and parameters

- Prefer a meaningful noun or noun phrase that names the value's meaning: distinguish, for example, a submitted amount from a persisted total rather than calling both `value`.
- Use collection names that make plurality or grouping clear. Keep temporary names short only when scope is tiny and meaning remains obvious; avoid unexplained one-letter names outside conventional short-lived indices.
- Give predicates a clear true/false reading (`is…`, `has…`, `can…`, or the language's idiomatic equivalent). Avoid negated or double-negative flags when a positive state is clearer.
- Include units, currency, timezone, ownership, or lifecycle in the name when omission could cause a real mistake. Keep representations explicit when two values otherwise look interchangeable.
- Avoid misleading names, number-series names, noise words, unexplained abbreviations, type-encoding prefixes, and names that merely repeat the declared type. Use established domain abbreviations only when the intended audience recognizes them.
- Avoid reusing a name for a different meaning within a nearby scope. Keep variables close to where they are used and limit their lifetime and visibility where the language permits.
- Name constants for their meaning and, where needed, their units or scope. Replace unexplained special values with a named constant or documented domain rule; do not promote every literal mechanically.

### Functions and methods

- Use an action-oriented verb phrase that describes the observable operation. A predicate should read like a question; a query should convey what it returns; a command should convey its side effect.
- Make the name and contract match actual behavior. Do not hide writes, network calls, state resets, logging, or other consequential side effects behind a name that promises only to inspect or calculate.
- Give each function one cohesive purpose at one understandable level of abstraction. A function may orchestrate several steps when they together are one named use case; “one thing” does not mean one line or one statement.
- Keep control flow and branching understandable. Extract a helper when it gives a meaningful name, isolates a concept, or enables focused testing—not merely to reduce line count. Prefer clear guard clauses over deeply nested flow when that improves readability.
- Use parameters that describe required inputs. Avoid long positional parameter lists, output parameters, or boolean flags selecting unrelated behaviors when they make call sites ambiguous. Split distinct operations or introduce a named options/value object only when that object is a real cohesive concept; do not wrap parameters just to satisfy an arbitrary count.
- Make mutation, I/O, errors, and ordering requirements explicit in the contract. Avoid surprising mutation of caller-owned inputs. Follow the language's idiomatic return/error model and make every relevant outcome observable to callers.
- Keep defaults safe and intentional. Avoid optional parameters whose implicit behavior changes the meaning of a call in a way the name does not reveal.
- Remove dead functions and stale branches only after checking references, reflection/registration, generated use, configuration, and external contracts.

### Classes, types, records, and interfaces

Use classes only where the language and design benefit from them; apply the same concepts to modules, records, algebraic data types, components, or other constructs in non-class-oriented languages.

- Name a type after the domain concept, stable role, or contract it represents. A class/type name normally reads as a noun or noun phrase; avoid vague role labels unless their scope is genuinely clear.
- Give a class a cohesive responsibility and a small, deliberate public surface. Judge size by responsibility, coupling, state, and change reasons—not line count or method count alone.
- Keep state that must remain consistent under one owner. Protect invariants at the boundary where state changes; do not expose mutable internals that let callers create invalid states.
- Construct objects in a valid, usable state where practical. Make required and optional inputs, defaults, resource ownership, and lifecycle clear. Use a named factory only when it resolves real ambiguity, validation, caching, or construction policy—not as a mandatory wrapper around every constructor.
- Avoid “god” classes that mix unrelated domain policy, persistence, transport, rendering, and orchestration. Extract cohesive responsibilities only when a real boundary or independent reason to change exists.
- Keep interfaces/protocols/contracts focused on what their consumers actually need. Do not create an interface for every class or split one cohesive contract into many tiny abstractions without a concrete benefit.
- Prefer composition when it expresses a relationship more accurately than inheritance. Use inheritance/subtyping only when every implementation can honor the base contract without surprising restrictions, invalid behavior, weakened guarantees, or type checks at call sites.
- Avoid service locators, global mutable state, and hidden construction dependencies when they obscure ownership or make behavior hard to test. Inject dependencies at real boundaries when it improves replaceability, isolation, or policy/detail separation.

## 2. Clean Code principles

- Optimize for readers and safe change: make intent obvious, keep related logic together, and use one vocabulary for one concept throughout a module.
- Prefer small, cohesive units, but do not split code into trivial wrappers that make readers jump through files without adding meaning.
- Keep each unit at a consistent level of abstraction. Separate domain decisions from parsing, transport, persistence, and presentation where that makes the ownership clearer.
- Reduce duplication when the duplicated behavior is genuinely the same rule and would otherwise drift. Similar-looking code with different invariants may be clearer kept separate; avoid premature abstractions.
- Use comments for rationale, constraints, non-obvious algorithms, compatibility promises, or safety assumptions. Do not restate clear code. Update or remove stale comments when behavior changes.
- Handle errors deliberately: preserve relevant context, map failures at the correct boundary, and do not swallow errors or report false success.
- Avoid hidden temporal coupling. If an operation requires prior initialization, a transaction, or a specific call order, make that lifecycle explicit in the API or encapsulate it.
- Keep tests readable and focused on behavior. Tests are maintained code; do not trade away clarity or isolation for superficial coverage.
- Follow formatting and style automation for the repository. Do not combine broad formatting churn with a focused behavior change unless requested.
- Prefer command/query separation when it makes side effects clearer; a command may still return its created resource or useful outcome when the contract calls for it. Do not add an extra read/race merely to force every function into a rigid category.
- Apply KISS and YAGNI to structure: solve the present requirement with clear control flow. Apply DRY to a shared business rule, not merely similar syntax. Keep coupling low and cohesion high; avoid reaching through another module's internals or long object chains to perform its responsibility.

## 3. SOLID as conditional design guidance

SOLID is a set of heuristics for managing change in designs where it is useful, not a compliance checklist. Apply the principle that solves an evidenced problem; do not add layers, interfaces, factories, or extension points merely to demonstrate SOLID.

### S — Single Responsibility

Keep a unit cohesive around one domain purpose, policy owner, or meaningful axis of change. One class can have several methods when they uphold the same responsibility; “one responsibility” does not mean exactly one method. Split when unrelated changes repeatedly collide, state is not cohesive, or focused testing/ownership is impaired.

### O — Open/Closed

Protect stable behavior from frequent changes by adding a deliberate extension point when variation is real and recurring. Do not predict every hypothetical future variation. A straightforward conditional or direct implementation is often simpler until change pressure demonstrates otherwise.

### L — Liskov Substitution

Any implementation or subtype used through a contract must honor that contract's inputs, guarantees, errors, invariants, and side effects. Do not strengthen preconditions, weaken promised outcomes, or require callers to inspect concrete types to avoid unsupported behavior. Prefer a better-fitting contract or composition over a false subtype.

### I — Interface Segregation

Consumers should not be forced to depend on capabilities they do not use. Split a large contract when distinct consumers genuinely need distinct capabilities and the split reduces coupling; avoid making a forest of one-operation interfaces without a real boundary.

### D — Dependency Inversion

Keep high-level policy from being unnecessarily bound to volatile low-level details. Depend on a stable contract and supply implementation details at a boundary when replaceability, testing, or architecture justifies it. An abstraction is not automatically beneficial: if the concrete dependency is stable and trivial, a direct call may be clearer.

### Applying SOLID to this stack

| Observed pressure | Useful response | Avoid |
|---|---|---|
| Checkout mixes HTTP parsing, pricing, persistence, and email | Let the controller map HTTP; keep pricing policy and checkout orchestration cohesive; isolate delivery where its lifecycle differs (SRP). | Moving every statement into a one-method class. |
| Several payment providers change independently | Use a focused gateway contract and supply the implementation at the composition boundary (OCP/DIP). | A factory/interface hierarchy for one stable local calculation. |
| A replacement gateway returns success before a payment is accepted | Align success, pending, failure, retry, and side-effect guarantees across implementations (LSP). | Calling implementations interchangeable because their method signatures match. |
| A read-only consumer must depend on mutation/admin operations | Expose the read capability it actually needs (ISP). | Arbitrarily splitting every method into a separate interface. |
| A React component mixes state, view, and unrelated lifecycle work | Separate a cohesive component/custom hook or pure policy function where it clarifies ownership. | Translating OOP patterns into mandatory React classes or hooks for every helper. |

## 4. Practical pre-merge questions

For behavior-affecting changes and refactors that add meaningful structure, follow the mandatory [necessity and minimality gate](../SKILL.md). The AI applies it internally against repository evidence; it is not a questionnaire for the user. Scale the check to the risk and skip irrelevant items for purely mechanical edits. The gate is not permission to cut required safeguards.

- Can a teammate infer each important name's meaning, unit, and responsibility from its use?
- Does each file/module have an obvious owner and purpose? Are public and internal boundaries clear?
- Do function and type contracts match actual behavior, mutation, errors, and side effects?
- Are classes/types cohesive and valid by construction, without exposing invariants to arbitrary callers?
- Is any abstraction or dependency solving an existing requirement, or only a hypothetical future one?
- Are SOLID principles improving change safety here, or adding indirection without reducing a real coupling?
- Are there stale comments, dead code, hidden order requirements, magic values, or inconsistent domain terms?
- Does the change fit the target language's idioms and project style without importing rules from another language?
