# Rule 07 - `containers/<url-path-name-container>/`

## Purpose
Route-level feature container boundary.

## Must
- One folder represents one screen/use case.
- Name the folder in kebab-case with a `-container` suffix (e.g., `user-profile-container/`, `order-list-container/`).
- Keep structure explicit: `index.tsx`, `controller.ts`, `types/`, `components/`.

## Must Not
- Mix multiple unrelated screens in one container.
- Duplicate common UI that belongs in `components/`.
- Place screen-specific components in the global `components/` folder — they belong in `containers/<name-container>/components/`.
