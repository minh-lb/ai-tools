# Rule 08 - `containers/<url-path-name-container>/index.tsx`

## Purpose
View composition for a container.

## Must
- Include `'use client'` at the top — this file uses React hooks from `useController`.
- Render UI layout for the screen.
- Read orchestration state/handlers from `useController` when needed.

## Must Not
- Call services directly.
- Contain heavy side effects.
