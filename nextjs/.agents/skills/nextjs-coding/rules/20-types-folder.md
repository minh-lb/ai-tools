# Rule 20 - `types/`

## Purpose
Global cross-feature type declarations.

## Must
- Include only truly shared types.
- Keep names stable and framework-agnostic when possible.

## Must Not
- Store container-local types (use container `types/` instead).
