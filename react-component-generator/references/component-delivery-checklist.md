# Component Delivery Checklist

Use this as a final self-check, adapting it to the target repository. The repository's conventions and explicit acceptance criteria take precedence over template defaults.

- Placement and filenames match nearby components; refactors preserve existing paths unless a move was requested.
- No template placeholders, sample content, unused imports/hooks, or unnecessary files remain.
- Rendering boundaries match the actual framework: no client directive in a non-RSC project and no server-only dependency in a client module.
- State, effects, derived values, and async work have a clear owner; controller/custom-hook separation is used only when it fits local practice.
- Props represent the component's real inputs and expose a coherent, understandable contract; no count-based split or grouping rule was applied mechanically.
- Loading, empty, validation, error, pending, and success behavior is truthful and recoverable where applicable; internal errors or secrets are not exposed.
- Controls use appropriate semantics, accessible names and labels, keyboard behavior, focus handling, and status/error communication for the interaction.
- Styling matches the existing system; no new styling or testing dependency was added without approval.
- Tests use the repository's actual runner and verify meaningful observable behavior. Missing test infrastructure or unrun browser/accessibility checks are reported honestly.
- Validation commands and results are reported exactly; the final diff contains only in-scope changes.
