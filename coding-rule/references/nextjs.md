# Next.js

Load for routing, rendering, data access, caching, and mutations. Identify installed Next.js/React versions, App Router vs Pages Router, runtime (Node/Edge), and deployment adapter first. Do not mix router APIs or assume caching defaults and request APIs are identical across versions.

## Routing and server/client boundaries

- Preserve framework file conventions and existing route structure. For App Router use Server Components by default where suitable; put `'use client'` at the smallest useful interactive boundary. For Pages Router use its data fetching and API-route contracts; do not retrofit App Router architecture incidentally.
- Keep server-only credentials, database clients, and privileged logic out of client import graphs. Mark server-only modules with the supported mechanism. Public environment variables and serialized props must be safe for the browser.
- Pass only data authorized for the current caller across the server/client boundary; use explicit view models rather than entire database records. Match the framework's supported serialization rules.
- Client Components may still be prerendered: avoid browser globals during server render and avoid nondeterministic server/client initial markup. Handle browser-only work with an appropriate lifecycle or supported boundary; do not hide hydration defects by suppressing warnings.
- Read data directly from the owning server-side module where appropriate instead of calling the application's own HTTP endpoint from a Server Component without a reason.

## Data and mutations

- Treat Route Handlers, API routes, and Server Actions as externally reachable boundaries. Validate inputs and authorize the current caller for the specific object/action at the server entry point or its trusted service boundary. Hidden UI, layouts, action identifiers, and middleware/proxy redirects do not establish authorization.
- Derive user/tenant identity from trusted session context. Do not trust hidden form fields or client-supplied ownership, price, or workflow state. Server Components and read requests must not trigger business writes during render.
- Define cache eligibility, freshness, key scope, and invalidation explicitly for the installed version. Keep user/tenant-private data out of shared caches unless scoped keys and access boundaries demonstrably isolate it; verify with two identities.
- After mutations, invalidate/revalidate affected data with supported APIs and refresh relevant UI according to the contract. A route refresh alone does not establish every cache is invalidated. Do not disable all caching globally as a routine fix.
- Fetch independent data concurrently where appropriate; handle failures and loading boundaries deliberately. Keep not-found, unauthorized, recoverable errors, and unexpected failures distinct using router-native facilities.
- Use framework navigation, images, fonts, metadata, and streaming where suitable and supported. Avoid adding client JavaScript or third-party loaders when existing server/native capabilities meet the requirement.

## Verification

Run applicable lint/type/build checks and route-level tests. For affected behavior, test direct navigation, reload, hydration, unauthorized direct action/handler calls, cross-user/tenant cache isolation, and UI freshness after writes. Verify runtime compatibility of imported libraries; a development server alone does not prove production rendering works.
