# Coding Rules: Laravel

> Read with `php.md` for language-level rules.

## 0. Naming conventions

- Controller: `{Noun}Controller` (`OrderController`), resourceful methods `index/show/store/update/destroy`.
- Form Request: `{Verb}{Noun}Request` (`StoreOrderRequest`, `UpdateOrderRequest`).
- API Resource: `{Noun}Resource` (`OrderResource`), collection via `::collection()`, not a separate hand-written `{Noun}CollectionResource` unless it needs extra top-level metadata.
- Job: verb-phrase describing the action (`SendOrderConfirmationEmail`, `ProcessPayment`), not `{Noun}Job`.
- Policy: `{Model}Policy` (`OrderPolicy`), methods matching Eloquent-style verbs (`view`, `update`, `delete`).
- Event: past-tense fact (`OrderShipped`); Listener: `{Verb}{Noun}` describing its reaction (`SendShippingNotification`).
- Enum: PascalCase noun for the concept, not the values (`OrderStatus`, not `OrderStatusEnum`).
- Migration file: `{timestamp}_{verb}_{description}` (`create_orders_table`, `add_status_to_orders_table`).
- Route URIs: kebab-case (`/order-items`); named routes dot-notation matching resource + action (`orders.store`).
- Model: singular PascalCase matching its plural snake_case table (`Order` ↔ `orders`).

## 1. Controllers thin

Controller: receive request → call service/action → return response. No business logic, complex queries, or long manual validation inline.

```php
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, CreateOrderAction $action)
    {
        $order = $action->execute($request->validated());
        return OrderResource::make($order);
    }
}
```

Multi-step business logic → Service/Action class (one class = one action). Reusable/complex queries → Repository, Query Object, or model scope, not repeated `->where()->whereHas()` chains across controllers.

## 2. Eloquent

- N+1: eager-load with `with()`. `Order::with(['items','customer'])->get()`, not `Order::all()` + loop access.
- `Model::preventLazyLoading()` in local/testing to surface N+1 during development.
- Filter/count/exists at the DB layer (`->where()`, `->count()`, `->exists()`), not `->get()` + PHP-side filtering.
- `chunk()`/`cursor()` for large datasets instead of `->get()` loading everything into memory.
- Mass assignment: explicit `$fillable` whitelist, not `$guarded = []`.
- Relationship method names: singular for `hasOne`/`belongsTo`, plural for `hasMany`/`belongsToMany`.

## 3. Validation

Form Request for complex/reusable validation, not repeated inline `$request->validate([...])`:

```php
class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
        ];
    }
}
```

Business-logic validation (stock check, context-dependent permission) → custom Rule class or Service, not crammed into `rules()`. Use `$request->validated()`, not `$request->all()`.

## 4. Authorization

Policy for model-tied authorization (`can('update', $order)`), Gate for non-model logic. No inline `if ($user->id !== $order->user_id)` scattered in controllers. Register via auto-discovery/`AuthServiceProvider`.

## 5. Database & migrations

> Schema-design/indexing rules (keys, column types, normalization, index justification) are in `sql.md` — read alongside this for anything beyond migration syntax.

- One clear change per migration; descriptive filename.
- Explicit `onDelete()`/`onUpdate()` on foreign keys — never leave implicit.
- Index columns used in `WHERE`/`JOIN`/`ORDER BY`, especially FKs.
- Never modify a migration already run in production — new migration instead.
- `NOT NULL` column added to a populated table MUST include `->default(...)` or a backfill in the same deployment.

## 5.1 Transactions (mandatory for multi-step writes)

Any write to 2+ tables/rows as one logical unit → `DB::transaction()`:

```php
DB::transaction(function () use ($orderData) {
    $order = Order::create($orderData);
    $order->items()->createMany($orderData['items']);
    Inventory::whereIn('product_id', $productIds)->decrement('stock');
});
```

Transaction alone does NOT prevent lost-update races (two concurrent checkouts decrementing the same stock). Read-modify-write on a concurrency-sensitive value (stock, balance, seat count) → row lock (`lockForUpdate()`) or atomic `->decrement()`/`->increment()`:

```php
DB::transaction(function () use ($productId, $qty) {
    $product = Product::lockForUpdate()->findOrFail($productId);
    if ($product->stock < $qty) {
        throw new InsufficientStockException($product->sku);
    }
    $product->decrement('stock', $qty);
});
```

Never swallow exceptions inside a transaction closure — let them propagate for rollback. No slow non-DB work (HTTP calls, sync email) inside the closure — do it before, or dispatch a Job after commit.

## 6. Queues & Jobs

Slow/non-immediate tasks (email, third-party API, file processing, notifications) → queued Job, not synchronous in the request cycle. Jobs must be idempotent (queues retry on failure). Set `$tries`/`backoff()` for important jobs; implement `failed()`.

## 7. Config & environment

Never `env('KEY')` outside `config/*.php` — always `config('key')` (`env()` breaks after `config:cache`). Secrets only in `.env`, never committed; keep `.env.example` with placeholder values.

## 8. API & responses

API Resource to format responses, never a raw Eloquent model as JSON:

```php
class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'total' => $this->total,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
```

Correct HTTP status semantics (201/422/404/403), not always 200 + `success: false`. Standardize error shape via the Exception Handler (`app/Exceptions/Handler.php` or `bootstrap/app.php` in Laravel 11+), not per-controller formatting.

## 9. Testing

`RefreshDatabase` + Factories, not manual row inserts:

```php
public function test_user_can_create_order(): void
{
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 10]);
    $response = $this->actingAs($user)->postJson('/api/orders', [
        'items' => [['product_id' => $product->id, 'quantity' => 2]],
    ]);
    $response->assertStatus(201);
    $this->assertDatabaseHas('orders', ['user_id' => $user->id]);
}
```

Feature tests for HTTP flow, Unit tests for pure Service/Action logic. Mock external services (payment, email, SMS) — never call real APIs in tests.

## 10. Security

- Don't disable CSRF unless the route has its own auth mechanism.
- `throttle` middleware on sensitive routes (login, forgot-password, public API).
- Check `$fillable`/`$guarded` on every new model field — most common mass-assignment hole.
- Never log PII (name, email, phone, address, payment data) in plaintext.
- CORS (`config/cors.php`): allowed origins MUST be an explicit list of known frontend domains, never `*` when `supports_credentials` is `true` (cookies/auth headers) — a wildcard origin with credentials enabled lets any site make authenticated requests on the user's behalf.

## 11. Additional rules

- Route model binding (typed `Order $order` param) over manual `findOrFail($request->id)`.
- Services/Actions MUST NOT call `Auth::user()`/facades for "current context" directly — pass the user in as a parameter (testable, reusable outside HTTP).
- Fixed-state model attribute (order status, role) → PHP Enum with Eloquent enum casting, not raw string/int + scattered comparisons (ties to OCP in `solid.md`).
- Never write app data directly from a migration beyond throwaway seed data — use a Seeder or Job.
- Folder structure: Laravel's default flat layout (`app/Http/Controllers`, `app/Models`, `app/Services` all mixing every domain together) is fine for a small app. Once the app covers several distinct domains (orders, billing, users...), group each domain's Controller/Request/Service/Model under its own namespace/folder (`app/Domain/Orders/{OrderController, StoreOrderRequest, CreateOrderAction, Order}`) instead of scattering one domain's files across several type-based folders — a domain becomes easier to find, change, and eventually extract. Don't restructure a small app this way preemptively (YAGNI).

## 12. Observability

- Structured logging: `Log::info('message', ['order_id' => $order->id, 'status' => $status])` — context as an array, never string-interpolated into the message text. Enables filtering/querying in log aggregators; string-interpolated logs don't.
- Match log level to severity — `debug` for dev-only detail, `info` for normal business events, `warning` for recoverable anomalies, `error`/`critical` for failures needing attention. Don't log everything at `error`, and don't log real failures at `info`.
- Correlation ID: accept an incoming `X-Request-Id` header, or generate a UUID if absent, in a middleware early in the pipeline. Attach it to every log line for that request (`Log::withContext(['request_id' => $id])` or Laravel's `Context::add()`), and forward the same ID as an outgoing header on any downstream/third-party HTTP call — this is what makes one request traceable end-to-end across logs and services.
- API versioning: pick one strategy (URI — `/api/v1/orders` — or an `Accept` header) and apply it consistently across the whole API, not mixed per-endpoint. A new version is for breaking changes only (changed response shape, removed field, changed semantics) — purely additive changes (new optional field, new endpoint) don't need one. Deprecated versions MUST have a stated sunset communicated to consumers (e.g. a `Deprecation`/`Sunset` response header), not a silent removal.

## Anti-patterns to avoid

- Business logic in Blade views or in Model accessors/mutators.
- Querying inside a Blade template (`@foreach` + `$user->orders()->count()`) — N+1, mixes layers.
- `DB::raw()` with unbound user input — SQL injection.
- Service Provider/`boot()` doing heavy work (DB/HTTP) on every request regardless of route.
