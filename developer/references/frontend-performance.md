# Frontend Performance Rules

This reference is for browser-based interfaces. Keep the main [Frontend](frontend.md) behavior, accessibility, and security rules in force: performance is not permission to remove useful content, controls, validation, or accessible behavior.

## Performance workflow

1. **Set a user outcome.** Identify what should become faster (first useful content, navigation, a particular interaction, scroll, or large-data task) and which users/devices/networks are affected.
2. **Establish a baseline.** Use representative field data when available and reproducible lab profiling to diagnose. Record route, browser/device, viewport, network/CPU conditions, data size, and percentile; do not compare incompatible runs.
3. **Find the bottleneck.** Separate server latency, network waterfalls, asset transfer/decode, main-thread work, rendering/layout, and backend/data cost. Optimize the measured critical path, not the easiest number to improve.
4. **Make one focused change and remeasure.** Keep correctness, accessibility, and visual stability checks green. Retain the optimization only when the observed user/system benefit justifies its complexity and maintenance cost.
5. **Set project-specific budgets.** Use explicit bundle, latency, or resource budgets when the product/team needs them. Do not invent one universal byte, request-count, or timing limit for every application.

## User-centric web metrics

When the project uses Core Web Vitals, use current [web.dev guidance](https://web.dev/articles/vitals) and verify it periodically because metrics/thresholds can evolve. Current “good” field targets are measured at the 75th percentile, segmented by mobile and desktop:

- **LCP ≤ 2.5 seconds** — loading/perceived main-content display.
- **INP ≤ 200 milliseconds** — responsiveness across meaningful interactions.
- **CLS ≤ 0.1** — visual stability during the page lifetime.

Treat field measurements as evidence of real-user experience; lab tools help reproduce and diagnose but may not reproduce actual user devices, networks, or interactions. Do not claim Core Web Vitals success from a single local run or an aggregate score that hides slow routes/devices.

## Loading, network, and assets

- Prioritize the resources required for the current route's primary content and interaction. Remove avoidable request waterfalls; start independent work concurrently while preserving dependencies and error boundaries.
- Fetch only data required for the visible task. Avoid duplicate requests and unnecessary fan-out; cache or reuse results only when freshness, authorization scope, and invalidation are correct.
- Split code by meaningful route/feature boundaries when it reduces initial work. Defer genuinely noncritical code; avoid both shipping large unused dependencies and creating excessive tiny chunks/request overhead.
- Inspect the actual shipped bundle and dependency graph. Remove unused code and expensive dependencies when evidence shows material user impact; do not rewrite a library for a hypothetical saving.
- Serve appropriately sized responsive images and modern formats where supported. Reserve dimensions/aspect ratio to prevent shifts. Defer below-the-fold media when helpful, but do not lazily delay the primary/LCP image without evidence it improves the experience.
- Limit font families, weights, and glyph ranges to real product needs. Load critical fonts deliberately and provide a stable fallback; do not preload every font or asset.
- Apply cache headers/versioning to immutable assets where appropriate. Treat personalized/API responses and user-specific caches carefully; a cache bug can become a data-isolation vulnerability.
- Compress and optimize resources using the existing build/hosting pipeline where practical. Avoid duplicate compression, manual asset transformations, and speculative resource hints that compete with critical work.

## Runtime, rendering, and interaction

- Keep long-running computation, parsing, and large synchronous work off the main interaction path when it measurably harms responsiveness. Chunk or yield long tasks using the platform/framework's supported mechanism.
- Avoid avoidable layout thrashing, repeated measurement/style writes, excessive DOM/component work, and expensive effects on every update. Profile before adding memoization or maintaining duplicate state.
- Keep UI state minimal and derived state derived. Prevent unnecessary network requests, state churn, and rerenders while preserving correctness for concurrent/stale responses.
- Bound rendering for genuinely large collections. Pagination, windowing/virtualization, or incremental rendering can help, but add them only when data size and measurement justify the extra interaction/accessibility complexity.
- Use debouncing/throttling only for the appropriate interaction and define cancellation/final-submit behavior. Do not delay actions where immediate feedback or correctness is required.
- Prefer compositor-friendly motion and avoid repeated layout/paint work for animation when the target browser supports a safe alternative. Respect reduced-motion preferences.
- Reserve space for content that loads later (images, embeds, ads, async components) and avoid shifting focus or the user's current task during updates.
- Avoid blocking the first useful render with noncritical scripts, styles, third-party embeds, analytics, or work that can safely happen later. Any deferral must preserve required behavior, privacy, and security.

## Anti-patterns

- Optimizing a microbenchmark while the actual bottleneck is a network dependency, server response, oversized asset, or main-thread task.
- Adding caching without a clear key, freshness policy, invalidation model, and user/tenant isolation.
- Applying memoization, virtualization, preloading, service workers, or speculative fetching everywhere without measurements.
- Lazy-loading the main content while eagerly loading noncritical resources, or preloading so many resources that priority is lost.
- Treating a lab score as field performance, comparing different routes/devices/conditions, or using a single average that hides tail-user impact.
- Reducing code size by removing accessibility, validation, useful error/recovery states, or correctness checks.

## Frontend performance verification

Use a repeatable before/after comparison with the same route, build mode, device class, viewport, network profile, data, and interaction. Inspect user-centric field data and/or browser traces, bundle/network waterfalls, main-thread long tasks, rendering/layout shifts, and relevant server/API timing. Re-run functional, responsive, keyboard/accessibility, and visual-regression checks affected by the optimization. State what was measured and what remains unverified.
