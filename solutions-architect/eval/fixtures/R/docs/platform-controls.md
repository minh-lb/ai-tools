# Platform controls, revision 4 · Approved

- **PLAT-01** Customer export data stays in the approved regional boundary. This applies to generated files, backups, and any telemetry containing customer payloads. Use the platform-managed private object storage. The platform team owns the storage and regional logging controls. Applications own what data they send to those services.
- **PLAT-02** Staff are authenticated through corporate SSO. Application services enforce the organization-scoped role for each export operation. The identity team owns membership data, and the export application team owns enforcement.
- **EX-01** A deviation from PLAT-01 requires a recorded approval from the Data Protection owner. An approval identifies the affected data and destinations, compensating controls, expiration date, and exit plan.
