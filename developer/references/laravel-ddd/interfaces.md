# Interfaces Layer

Use the interfaces layer for HTTP, CLI, messaging, or other external entry points when the target architecture separates them from application/domain behavior.

## HTTP responsibilities

- Validate and authorize at the correct request boundary using the project's established FormRequest, policy, middleware, schema, or equivalent.
- Pass only validated, appropriately mapped input to the application flow.
- Shape output with the existing Resource/serializer/response contract. Do not create an `ApiResponse` envelope merely because a template exists.
- Keep status codes, error bodies, localization, and compatibility aligned with the approved API contract and neighboring endpoints.

The sample `Request`, `Resource`, `Controller`, and `ApiResponse` templates are optional. A public endpoint may intentionally allow unauthenticated access; a private endpoint should use the project's actual policy/resource check rather than assuming authentication alone is sufficient.

## Routes and middleware

Register routes using the repository's actual Laravel/module convention. Apply the approved authentication, authorization, throttling, and other middleware at the correct boundary. Do not assume a module service provider or a particular route-file path exists.

## Testing

Use feature tests that match the actual endpoint contract. Cover authorized behavior, relevant unauthenticated/unauthorized cases, validation, response shape/status, and important persisted or emitted effects. Derive exact status codes and response fields from the project contract; do not copy the template's sample envelope or status.
