# Implementation notes — [Task]

Spec: [Link]
Scope: [Change]

## Open question
- **[Q]:** [Case, unknown, impact, confirmer; `chờ xác nhận`]

## Flow
```mermaid
flowchart LR
    subgraph OLD["TRƯỚC · logic cũ"]
        A["Entry"] --> B["LOGIC CŨ: old step"] --> C{"Result?"}
        C -->|success| D["Old result"]
        C -->|error/empty| E["Other"]
    end
    subgraph NEW["SAU · logic hiện tại"]
        F["Entry"] --> G["ĐÃ ĐỔI: current step"] --> H{"Result?"}
        H -->|success| I["Current result"]
        H -->|error/empty| J["Other"]
    end
    classDef old fill:#fef3c7
    classDef changed fill:#dbeafe
    class B old
    class G changed
```
Cite pre-change old and final current code; say if old is unverified.

## Decisions
- [Decision + reason.] **Status:** [Approved/source or `chờ xác nhận`]. **Evidence:** [Links relative to this note]

**Example:** [Input → outcome; source]

## Deviations / tradeoffs (optional)
- [Difference/approval; chosen option vs alternative cost]

## Verification
- `[Command]` — [Result/limits]
