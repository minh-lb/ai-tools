# Rule 19 - `config/env.ts`

## Purpose
Typed environment gateway.

## Must
- Validate and export environment variables from one file.
- Fail fast for missing required variables.

## Must Not
- Scatter env parsing across pages/containers/services.
