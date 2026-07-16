# Coding Rules: SQL

> Any raw SQL — queries, schema, migrations — regardless of host language or DB engine. Eloquent-specific rules are in `laravel.md`; this file covers the underlying SQL, including inside a query builder's raw escape hatch.

## 1. Injection prevention (non-negotiable)

User input MUST NEVER be concatenated into a SQL string — always parameterized queries/prepared statements:

```sql
-- Wrong
"SELECT * FROM users WHERE email = '" + userInput + "'"
-- Correct
SELECT * FROM users WHERE email = ?
```

Dynamic identifiers (table/column names, sort direction) can't be parameterized — MUST be validated against a strict allowlist, never passed through raw. Stored procedures need the same parameterization/allowlist treatment for any dynamic SQL inside them.

## 2. Schema design

- Naming: tables plural snake_case (`order_items`), columns snake_case, primary key `id`, foreign key `{singular_referenced_table}_id` (`user_id` → `users`). Boolean columns prefixed `is_`/`has_` (`is_active`). Timestamp columns `created_at`/`updated_at` (and `deleted_at` for soft deletes) unless a framework convention dictates otherwise.
- Every table MUST have a primary key (surrogate `id`/UUID unless a stable natural key exists).
- Foreign keys MUST be declared at the DB level with explicit `ON DELETE`/`ON UPDATE` (`CASCADE`/`RESTRICT`/`SET NULL`) — app-only enforcement allows orphaned rows from any direct DB access.
- Column types matching the domain: `DATE`/`DATETIME`/`TIMESTAMP` for dates (never strings), `DECIMAL`/`NUMERIC` for money (never `FLOAT`/`DOUBLE`), narrowest integer type that fits.
- Logically required columns MUST be `NOT NULL` at the schema level — not enforced only by app validation.
- Normalize to 3NF by default; denormalization for read performance is a deliberate, documented exception, not the default.

## 3. Indexing

- Every foreign key column MUST be indexed.
- Index columns in `WHERE`/`JOIN ... ON`/`ORDER BY` of frequently-run queries.
- Composite index matching the actual multi-column filter pattern over several single-column indexes; most-selective/most-often-filtered-alone column first.
- Don't over-index — every index costs on `INSERT`/`UPDATE`/`DELETE`. Add one because a query's pattern genuinely needs it.
- Write queries so they can actually use an existing index (see section 4) — an index the query structure can't use provides no benefit.

## 4. Query writing

- MUST NOT `SELECT *` — list needed columns only (breaks silently on schema change, transfers unneeded data, defeats covering indexes).
- Don't wrap an indexed column in a function inside `WHERE` (`WHERE YEAR(created_at) = 2024`) — this blocks index use. Use a range comparison instead.
- `JOIN` over a correlated subquery re-executed per outer row.
- `EXISTS`/`JOIN` for existence checks, not `COUNT(*) > 0` or pulling all matching rows.
- Explicit `ORDER BY` whenever result order matters — SQL doesn't guarantee order otherwise.
- Paginate any query with unbounded result size (`LIMIT`/`OFFSET`, or keyset/cursor pagination for large offsets) — never fetch a whole table to filter in app code.

## 5. Transactions & concurrency

- Multi-statement operation that must succeed/fail as a unit → explicit transaction (`BEGIN`/`COMMIT`/`ROLLBACK`, see `laravel.md` for the Eloquent form).
- Keep transactions short — never hold one open across a slow external call or user-interaction wait.
- Read-modify-write on a concurrency-sensitive value (balance, stock, seat count) → row lock (`SELECT ... FOR UPDATE`) or a single atomic statement (`UPDATE ... SET stock = stock - 1 WHERE id = ? AND stock >= 1`, checking affected-row count). A plain `SELECT` then separate `UPDATE` is a race condition under load.
- Choose isolation level deliberately when the default doesn't fit (e.g. reporting can tolerate `READ COMMITTED`; financial operations may need stricter guarantees).

## 6. Migrations

- Reversible, or at minimum forward-only and idempotent.
- Never edit a migration already run in a shared environment — new migration instead.
- `NOT NULL` column added to a populated table MUST include a default or backfill in the same migration/deployment.
- Large schema changes on a populated table (new index, column type change) SHOULD account for the engine's locking behavior for that operation — some lock the table for the duration.

## Anti-patterns to avoid

- Concatenating any part of a query from user input, "just one column name" included.
- `SELECT *` in application code.
- Missing index on a FK or a frequently-filtered/sorted column.
- N+1 query pattern (one query per row in a loop) — see `laravel.md` for the Eloquent-specific version.
- Money as `FLOAT`/`DOUBLE`, dates as unstructured strings.
- Read-decide-in-app-then-write-back without a lock/atomic statement under concurrent access.
- Unbounded queries with no `LIMIT`/pagination on growing tables.
