# Rule 10 - `containers/<url-path-name-container>/types/`

## Purpose
Container-local type contracts.

## Must
- Store view models, local DTOs, and local prop contracts for the container.
- Use explicit names that reflect screen intent.

## Must Not
- Store truly global cross-feature types.

## Templates

- `types/index.ts.template` — barrel file; re-exports types imported by `controller.ts` and `index.tsx`. Create this first.
- `types/example.types.ts.template` — use for view models or local DTOs not defined in the service layer.
