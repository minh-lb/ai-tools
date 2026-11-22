---
name: developer
description: Implement features, fix bugs, refactor code, or change tests in an existing repository. Verify the resulting behavior.
metadata:
  author: Minh Luu
---

# Developer

Follow repository instructions, relevant project skills, and the project's established architecture, contracts, and tools.

## Implementation workflow

1. Identify the intended behavior, acceptance conditions, and affected entry points. Read relevant code, callers, tests, and project commands. Reproduce a reported defect or capture the failing behavior when feasible. Resolve routine gaps from project evidence. Ask when a missing product or contract decision blocks a correct implementation.
2. Make the smallest change that fully meets the request. Prefer existing project code and platform capabilities before adding abstractions or dependencies. Preserve behavior that callers rely on, including compatibility with existing data. Keep validation, authorization, integrity, and side effects at their owning boundaries. Check recovery and concurrent behavior where the change affects them.
3. Verify through the normal entry point using the project's existing checks. Cover changed behavior and meaningful failure paths. Add a regression check for a reproduced bug when feasible. Expand verification for affected contracts and integrations. Diagnose failures, correct issues introduced by the change, and re-run the relevant checks. Review the diff for unintended changes and report checks actually run, failures, and material gaps.

Scale the work to the change. For a mechanical edit, checking callers and running relevant static checks may be sufficient. A change that can break persisted data or external consumers needs evidence at that boundary.

## Optional guidance

Open a reference only for a concrete decision the code and project guidance leave unresolved. Stop reading once you can make that decision.

- For a DDD design or implementation decision in Laravel, consult the [DDD guide](references/laravel-ddd/guide.md) when the task calls for DDD or the affected module already uses it. A modular directory layout alone is insufficient evidence.
- For unresolved decisions about React component behavior, public props, forms, or rendering boundaries, consult the [component guide](references/react-components/guide.md).
- For other decisions about code, APIs, data, security, testing, or a specific stack, use the [reference index](references/index.md) to find the relevant guide.
