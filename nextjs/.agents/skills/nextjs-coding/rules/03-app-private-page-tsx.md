# Rule 03 - `app/(private)/<url-path-name>/page.tsx`

## Purpose
Private route entrypoint.

## Must
- Compose container component(s) only.
- Keep access-control assumptions aligned with private area.

## Must Not
- Inline screen orchestration.
- Direct API calls.
