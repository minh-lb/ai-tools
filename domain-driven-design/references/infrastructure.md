# Infrastructure Layer

When the target architecture uses an infrastructure boundary, this layer adapts persistence, framework services, messaging, and external clients to the application's or domain's contracts.

## Possible responsibilities

- Keep Eloquent models aligned with the existing persistence convention; do not treat ORM models as domain entities when the project separates them.
- Map persisted fields explicitly to and from domain/application data; preserve casts, nullability, identifiers, and serialization behavior.
- Bind adapters using the repository's service-provider/container registration pattern. Do not add a provider or binding layer when the project uses another established mechanism.
- Keep infrastructure-specific concerns out of domain invariants.

## Query-side operations

Choose query ownership based on project practice and behavior. Simple reads may use a repository/query object/read model; business filtering and aggregation should remain in the layer that owns the rule. Do not bypass authorization, tenant scoping, or domain invariants merely because a query is read-only.

## Persistence and deletion

Persist all fields that belong to the current entity/record contract. Make deletion semantics explicit: soft delete, archival, retention, cascades, and permanent deletion differ. Do not generate a hard-delete operation unless the requested behavior and data-retention/relationship policy establish that it is correct.

## Testing

Use the project's database factories, transactions, and integration-test conventions. Verify mappings and important constraints against the supported database when unit mocks cannot prove them.

## Tenant scope and concurrency

- If the product is multi-tenant, define the tenant owner of each row/aggregate and require scope on ID-based **reads and writes**; default Eloquent ID lookup is not isolation by itself. Authenticate/authorize at the application/interface boundary and derive tenant identity from trusted context.
- Check relationships and unique constraints within the approved tenant scope. Use database constraints and tenant-aware associations where relevant; never rely on client-provided tenant IDs or filtering in the frontend.
- A read-then-save sequence can lose concurrent updates. Choose conditional version updates, row locking, unique constraints, or a documented idempotent operation for the actual risk. Detect and report conflicts rather than silently overwriting state.
- `updateOrCreate()` is not a generic safe aggregate save: creation vs update, tenant constraints, version checks, field mappings, and row lifecycle must be decided for the specific model. See [consistency.md](consistency.md).
