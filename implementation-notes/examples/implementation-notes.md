# Implementation notes — Order search (fictional)

Spec: `docs/specs/order-search.md`

## Open questions
- 51 matches: pagination is unspecified. Keep current behavior pending product confirmation (`chờ xác nhận`).

## Flow
```mermaid
flowchart LR
    subgraph OLD["TRƯỚC · logic cũ"]
        A["Type code"] --> B["LOGIC CŨ: Live, case-sensitive"]
        B -->|match| C["Results"]
        B -->|no match| D["Empty"]
        B -->|API error| E["Error"]
    end
    subgraph NEW["SAU · logic hiện tại"]
        F["Type code"] --> G["ĐÃ ĐỔI: Click, case-insensitive"]
        G -->|match| H["Results"]
        G -->|no match| I["Empty"]
        G -->|API error| J["Error"]
    end
    classDef old fill:#fef3c7
    classDef changed fill:#dbeafe
    class B old
    class G changed
```
Old: pre-change tests; current: final code.

## Decision / tradeoff
- Approved: `ab-12` matches `AB-12`; click-to-search cuts API calls but adds an action.

## Verification
- `npm test -- order-search` — 12 passed (fictional); browser not run.
