# Verification

Use after generating or updating a DDD-oriented slice. Check only files and mechanisms that the task actually uses.

## Consistency checks

- Every generated file is needed for the requested behavior and follows the target repository's path, namespace, and naming conventions.
- Template placeholders, illustrative fields, unused imports, and unused files are removed.
- Domain behavior does not accidentally depend on HTTP, Eloquent, facades, or concrete infrastructure where the repository separates those layers.
- Validation, authorization, response shape/status, transaction ownership, deletion/retention semantics, and error behavior match the approved project contract.
- Persistence mappings include all current fields and preserve identifier, cast, nullability, and constraint behavior.
- If a custom DTO validation convention is used, rules cover the actual constructor/input shape and `fromArray()` safely handles contract-approved values. Do not require `#[Rules]` for other validation designs.
- If an event consumer needs deduplication, event identity is stable across retries and the completion marker cannot permanently suppress failed work. Verify duplicate, failure/retry, and relevant concurrency paths.
- Cross-module communication follows the target project's contract; async consumers are not represented as synchronous calls.

## Validation

- Run targeted unit, feature, integration, static, and framework checks that exist and are safe.
- Verify request/response behavior against the current contract; do not assume an `ApiResponse` envelope or sample HTTP status.
- Exercise important side effects and failure/recovery behavior at the right boundary.
- Report skipped or unavailable checks honestly. Do not claim a migration, external integration, or queue guarantee was validated unless it was actually tested.
