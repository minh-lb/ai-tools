# Naming Conventions for PHP, JavaScript, and TypeScript

Use for naming decisions. For the reasoning behind names and responsibility, consult only section 1 of [Code structure](code-structure-and-clean-code.md). Repository conventions, public contracts, generated names, framework discovery, and route filenames take precedence over these fallback defaults. Keep code identifiers in the project's established language; use one domain term consistently.

## Defaults when the repository has no convention

| Element | PHP / Laravel | JavaScript / TypeScript / React / NestJS |
|---|---|---|
| Variable / parameter / property | `$pendingOrders`, `$timeoutMs` | `pendingOrders`, `timeoutMs` |
| Function / method | `calculateTotal()`, `cancelOrder()` | `calculateTotal()`, `cancelOrder()` |
| Boolean / predicate | `$isActive`, `canPublish()` | `isActive`, `canPublish()` |
| Class / interface / trait / enum / type | `OrderService`, `PaymentGateway` | `OrderService`, `PaymentGateway`, `OrderStatus` |
| Named domain constant | `MAX_RETRY_ATTEMPTS` | `MAX_RETRY_ATTEMPTS` for fixed configuration/domain constants; ordinary local `const` bindings remain camelCase |
| Class source file | `OrderService.php`, matching namespace/autoload rules | Follow project; Nest commonly `order.service.ts` and `create-order.dto.ts` |
| Component / hook | Follow the template/component system | `OrderSummary`, `useOrderFilters`; files follow project (`OrderSummary.tsx` or `order-summary.tsx`) |
| Ordinary module / directory | Existing namespace/framework layout | Existing casing; use kebab-case as a fallback for ordinary modules/directories |
| Test file | `OrderServiceTest.php` or suite convention | `order.service.spec.ts`, `order-summary.test.tsx`, or suite convention |

- Keep framework contracts exact: Next.js `page.tsx`, `layout.tsx`, `route.ts`, Laravel migration conventions, and PSR-4 namespace/path case. Check case-sensitive import resolution even on case-insensitive developer machines.
- Database columns and external JSON fields follow their own contract, often snake_case in Laravel. Map at a boundary when needed; do not silently rename wire fields to match local variables.
- Use plural names for collections (`orders`), singular for an item (`order`), and keyed names for maps (`ordersById`). Use `OrderId` instead of ambiguous `id` when multiple identities coexist.
- Name units and representation where errors are plausible: `timeoutMs`, `amountMinorUnits`, `expiresAtUtc`. Do not label a local date or string as UTC without conversion.
- Use `handleSubmit` for an internal event handler and `onSubmit` for a callback prop where that matches project practice. A custom hook must begin with `use`; an ordinary utility must not pretend to be a hook.
- Distinguish a business interface from its implementation by role (`PaymentGateway`, `StripePaymentGateway`), rather than mandatory `I` prefixes, `Impl`, `Base`, or `Abstract` labels. Preserve established conventions.
- Avoid vague names (`data`, `manager`, `utils`) at broad scope. A boundary variable such as `response` is fine when its meaning is obvious locally. Do not replace familiar domain abbreviations with verbose noise.
- Keep private symbols private; export only deliberate module contracts. Do not introduce barrel files or default-vs-named export changes merely to enforce a new preference.

## Review check

Can a reviewer identify purpose, type/shape where relevant, units, ownership, and side effects from the name and call site? A name change must update imports, tests, reflection/registration, routes, and callers that actually depend on it; public renames need compatibility review.
