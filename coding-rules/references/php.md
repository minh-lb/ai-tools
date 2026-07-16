# Coding Rules: PHP

> Any PHP code.

## 1. Coding standard

PSR-12 style, PSR-4 autoloading (`Vendor\Package\SubNamespace` matching `composer.json`'s `autoload.psr-4`). `declare(strict_types=1);` at the top of every file where the project allows it.

## 2. Type declarations

Types on all parameters, return values, properties:
```php
public function calculateTotal(array $items, float $taxRate): float { /* ... */ }
```
Nullable (`?string`)/union (`int|string`) types over ambiguity. `readonly` properties (8.1+) for DTOs/Value Objects. Enums (8.1+) instead of scattered constants for a fixed value set.

## 3. Naming

`PascalCase` class/interface/trait/enum, `camelCase` method/property/variable, `UPPER_SNAKE_CASE` constants. File name matches class name.

## 4. Error & exception handling

Exceptions, not `null`/`false`/error codes, to signal business errors. Custom exception per domain error type:
```php
final class InsufficientStockException extends \RuntimeException
{
    public function __construct(string $sku)
    {
        parent::__construct("Product {$sku} is out of stock");
    }
}
```
No `@` suppression — handle explicitly. `catch` specific types; `catch (\Throwable $e)` only at the outermost boundary (global handler/logger).

## 5. OOP & structure

SOLID in moderation — SRP and DIP (type-hint interfaces, not concrete classes) matter most. Composition over inheritance beyond 2-3 levels. Constructor injection over inline `new` for dependencies. `final` on classes not designed for extension.

## 6. Security

- Prepared statements/parameter binding — never concatenate user input into SQL.
- Escape HTML output when the template engine doesn't auto-escape.
- Never log/echo sensitive data (passwords, tokens, card data), even in dev.
- `password_hash()`/`password_verify()` — never homemade hashing or raw MD5/SHA1.
- `hash_equals()` for comparing secrets/tokens/signatures — plain `===` is timing-attack-vulnerable.
- `var_dump()`/`print_r()`/`dd()` MUST NOT remain in shared-branch code.
- Never `extract()` on untrusted data — can silently overwrite in-scope variables including security guards.

## 7. Composer & dependencies

Commit `composer.lock`. Separate `require` (runtime) from `require-dev` (test/lint/debug).

## 8. Testing

PHPUnit; unit-test pure logic decoupled from I/O via interfaces/mocks. Test names describe behavior (`test_it_throws_exception_when_stock_is_insufficient()`). Tests independent of order/leftover state.

## Anti-patterns to avoid

- `global $x` / raw `$_SESSION`/`$_GET` in business logic instead of an abstraction layer.
- "God Object" classes handling DB + validation + email all at once.
- `==`/`!=` instead of `===`/`!==` unless coercion is intentional.
- Unvalidated input type from untrusted sources (requests, uploads, third-party APIs).
