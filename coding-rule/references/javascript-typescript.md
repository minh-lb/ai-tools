# JavaScript and TypeScript

Load for language, type, module, or async decisions. Match supported runtimes, package module format, TypeScript configuration, and existing lint/format tools. Do not convert JS to TS or tighten the entire project's compiler settings as an incidental edit.

## Values and contracts

- Prefer `const`; use `let` for reassignment and avoid new `var` in modern code. `const` prevents rebinding, not nested mutation. Make ownership clear before mutating arrays/objects; `readonly` is a compile-time constraint, not runtime freezing.
- Use precise types at public boundaries; infer obvious local types. Prefer `unknown` for untrusted values and narrow/validate before use. Avoid `any`, unsafe assertions, non-null assertions, and suppression directives that conceal a missing guarantee.
- TypeScript types and `as` casts do not validate HTTP responses, request payloads, environment variables, storage, or queues. Parse them with the project's runtime validator and return a deliberate failure on invalid data.
- Represent distinct states with discriminated unions when multiple optional fields/flags allow impossible combinations. Use exhaustive handling for closed unions and an explicit unknown-value policy at external boundaries.
- Preserve the difference between absent, `undefined`, `null`, `false`, `0`, and empty string. Use `??` for nullish defaults when falsy values are valid; do not use optional chaining to hide an invariant violation.
- Prefer strict equality unless a documented coercion is required. Avoid implicit numeric/string conversions at boundaries. Use explicit date/timezone rules and a safe money representation rather than floating-point currency arithmetic.
- Use generics when they express an actual relationship between inputs and outputs; avoid type puzzles that obscure a simple domain model. Follow repository conventions for `type` vs `interface` and enums vs literal unions.

## Async and errors

- Await or return promises when completion/errors matter. Do not use async callbacks with `forEach` expecting the loop to await them. Explicitly handled background work needs ownership and a failure path.
- Use sequential awaits for dependent operations; parallelize independent operations with bounded concurrency. `Promise.all` rejection does not cancel siblings or undo completed side effects; use `allSettled` only when partial outcomes are part of the contract.
- Apply timeouts/cancellation at external boundaries and ignore stale results where cancellation cannot guarantee freshness. Clean up timers, listeners, subscriptions, and other owned resources.
- Catch errors where recovery, translation, or diagnostic context is useful. Narrow caught `unknown` values before accessing fields. Do not replace failures with empty arrays or success-shaped defaults unless the contract defines that fallback.
- Keep CPU-heavy synchronous work off request/render hot paths when measured impact warrants a worker or other platform facility.

## Modules and verification

- Keep dependencies directed across feature/public boundaries; avoid circular imports and deep imports into another module's internals. Distinguish type-only imports where appropriate, except framework runtime metadata requires a value import (see [NestJS](nestjs.md)).
- Reuse configured ESLint/formatter/typecheck scripts; do not add overlapping formatters or change project-wide rules for a local edit. Avoid committing generated clients/build artifacts unless project policy requires them.
- Verify invalid runtime input, nullish/falsy values, rejected promises, and stale/concurrent results when affected. A successful typecheck alone does not establish runtime correctness.
