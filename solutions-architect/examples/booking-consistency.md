# Prevent double booking of a room slot

**R1.** At most one reservation can be confirmed for a room at a given slot. A second caller receives a conflict. The app already uses a relational database and slots have discrete identifiers. The confirmed reservations table holds active confirmations. Cancellation moves the record to history and frees the slot under the existing lifecycle.

**ADR-01 · Enforce slot ownership in the database.** A read-before-write check admits both requests if both read before either inserts. Use a uniqueness constraint on the room and slot in the confirmed reservations table. The request transaction inserts once and maps the uniqueness violation to a conflict. The constraint protects every insert path and keeps booking in the existing transaction. Any future change to which records occupy a slot must revisit the constraint.

**Review finding F1 · High.** The submitted read-before-write design allows double confirmation when two requests read an empty slot and each inserts a row. The proposed constraint closes the design defect for the stated slot model. The revised design was walked through again below.

| Requirement | Scenario | Method | Design result |
| --- | --- | --- | --- |
| R1 | A and B submit the same room and slot. A commits first, then B's insert is resolved. | Tabletop | The unique key permits one row. B gets a conflict. If A rolls back before B's insert resolves, B can succeed. |
| R1 | Two requests book different room/slot pairs. | Tabletop | The constraint permits both rows. |
| R1 | Concurrent integration check against the target database and conflict handler. | Planned | Expect one stored reservation and one conflict for a shared slot. No runtime check performed in this example. |

**Readiness for discrete slot creation.** Ready for Implementation under the confirmed discrete-slot requirement and existing relational database capability. Implementation acceptance still requires the concurrent integration check. Changes to cancellation behavior need a separate lifecycle decision. Design approval is unrecorded.
