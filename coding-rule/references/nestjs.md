# NestJS

Load for modules, controllers, providers, DTOs, guards, and request lifecycle. Check NestJS/TypeScript versions, HTTP adapter, metadata configuration, and transport; HTTP, GraphQL, WebSocket, and microservice errors/lifecycle are not interchangeable.

## Modules and ownership

- Group cohesive features in modules and export only intentional providers. Keep controllers focused on request mapping and orchestration, with meaningful use-case logic in owning providers/services; avoid a generic mega-service.
- Use constructor injection and registered providers/tokens at real dependency boundaries. TypeScript interfaces disappear at runtime: use a concrete class or explicit token binding for DI. Avoid service locators and unnecessary manual construction of injectable dependencies.
- Resolve ownership/import cycles before reaching for `forwardRef`; it is a compatibility tool, not a substitute for clear module boundaries. Do not make every module global to avoid imports.
- Default providers are shared singletons. Keep caller/tenant-specific mutable state in explicit call context or an appropriate scoped mechanism; never overwrite `this.currentUser` per request on a singleton. Choose request/transient scope only for a concrete lifecycle need and account for propagation/cost.

## Validation and access control

- A DTO type annotation is not validation. Verify an active `ValidationPipe` or the project's runtime-schema equivalent at the intended boundary. Decorator-based DTO validation requires runtime classes and appropriate decorators; a type-only import/interface cannot supply missing metadata.
- Choose whitelist/unknown-field policy explicitly (`whitelist`, `forbidNonWhitelisted`, or schema equivalent). Do not assume arbitrary nested objects are validated; configure nested transformation/validation and array-item constraints where needed.
- Parse query/path scalars deliberately. `transform` is not proof that all strings coerce correctly; check empty strings, booleans such as `'false'`, numeric ranges, UUIDs, and invalid values. Define omitted vs null behavior for partial-update DTOs.
- Use guards for authentication/route access and enforce object/tenant permissions at the owning service/data boundary too. Roles or a valid JWT alone do not authorize every resource. Reuse trusted principal context rather than trusting body-supplied identity.
- Keep concerns distinct: pipes validate/transform; guards decide access; interceptors handle appropriate cross-cutting behavior; filters map errors for the transport. Do not hide domain policy inside a generic response interceptor.
- Return deliberate response DTOs/serializers. Do not expose ORM entities, secrets, or internal exception details. Swagger/OpenAPI annotations document the contract but do not enforce it at runtime.

## Persistence, work, and verification

- Follow the installed ORM's transaction/context API; all transactional operations must share the intended transaction context. Preserve invariants against concurrent writes and send dependent work after commit when required.
- Await/return asynchronous work and handle Observable completion/errors according to the chosen transport. Keep retries, timeouts, and queue idempotency explicit; do not block Node's event loop with heavy synchronous work.
- Validate required configuration at startup using existing facilities. Keep graceful shutdown/resource cleanup compatible with deployment and worker lifecycle.
- Use unit tests for policy and provider behavior; use an initialized Nest application for tests claiming pipes/guards/filters/serialization work. Ensure test bootstrap enables the production settings being tested. Cover invalid and extra fields, nested DTOs, object authorization, and parallel requests under different identities when affected.
