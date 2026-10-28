# PHP

Load for PHP language/type decisions. Check `composer.json`, lockfile, platform constraints, autoload configuration, and the repository formatter/static analyzer before choosing syntax. Use its declared PSR-12/PER or framework style; do not migrate formatting standards incidentally.

## Types and values

- Declare useful parameter, return, and property types supported by the pinned PHP version. Use PHPDoc for information native types cannot express, such as collection element types, array shapes, and analyzer generics; do not duplicate obvious types or leave stale annotations.
- Follow project policy for `declare(strict_types=1)`; use it in new application files when that is the chosen convention. It is not runtime validation of payloads, and scalar strictness depends on the calling file. Do not bulk-enable it without compatibility review.
- Distinguish missing keys, explicit `null`, `false`, `0`, and `'0'`. `isset` treats null as unset; `array_key_exists` distinguishes presence. `empty` discards valid falsy values; choose deliberately for PATCH and form handling.
- Prefer explicit comparisons; use strict `in_array` when type distinctions matter. Normalize validated input once at the boundary, rather than relying on scattered coercion.
- Use date/time objects with deliberate timezone semantics; prefer immutable dates when mutation would be surprising. Use minor units or an established decimal abstraction for money; do not invent floating-point rounding policy.
- Use enums, readonly properties/classes, constructor promotion, and `match` only when supported and clearer. Do not mark every class final/readonly or introduce a value object for every scalar without a concrete benefit.

## Structure and failures

- Honor namespace/autoload case and class filenames. Keep visibility as narrow as practical and initialize required state coherently.
- Use exceptions for exceptional failure according to local contracts; use explicit domain outcomes for expected alternatives where clearer. Catch a specific exception when recovery is specific; catch `Throwable` only at a boundary that can deliberately handle/report both errors and exceptions.
- Do not suppress errors with `@` or convert failure to false success. Ensure resource cleanup using `finally` or platform facilities when resources outlive a single statement.
- Prefer injected dependencies at meaningful seams over hidden globals. Existing Laravel facades and Eloquent patterns are framework conventions, not automatic reasons to invent repository/interface layers.
- Avoid by-reference parameters or shared mutable objects unless their semantics are explicit and necessary. Keep collection processing readable; chained closures are not inherently cleaner than a straightforward loop.

## Verification

Use the project's scripts for PHP syntax, formatter checks (for example Pint/PHP-CS-Fixer), PHPStan/Larastan/Psalm, and PHPUnit/Pest as available. Do not install all of these. Test meaningful coercion, absent/null/falsy inputs, exceptions, and persistence boundaries touched by the change; syntax checks alone do not verify behavior.
