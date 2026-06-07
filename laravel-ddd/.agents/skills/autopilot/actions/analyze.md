# Analyze Action

1. Resolve spec: read `docs/current-feature.md` to get the active spec path; load the spec file if not already in context. If `$ARGUMENTS` is raw text, run `spec` first.
2. Use already-loaded project overview and coding standards; read them only if not in context.
3. Inspect only source/tests related to the spec.
4. Output affected modules, new files, modified files, risks, and assumptions.
5. Set current feature status to `In Progress` when implementation is about to begin.
