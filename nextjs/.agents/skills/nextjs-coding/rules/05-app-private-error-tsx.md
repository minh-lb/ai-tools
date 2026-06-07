# Rule 05 - `app/(private)/<url-path-name>/error.tsx`

## Purpose
Route-level error boundary UI.

## Must
- Include `'use client'`.
- Support retry/recovery pattern for current Next.js version.

## Must Not
- Perform server-only operations directly.
- Hide error state without user feedback.
