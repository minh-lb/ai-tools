# Coding Rules: Docker

> Applies to any Dockerfile/docker-compose file regardless of what runs inside the container.

## 1. Base image

- Pin to a specific version tag (`node:20.11-slim`, `php:8.3-fpm-alpine`), never `latest` (non-reproducible).
- Prefer minimal base (`-slim`, `-alpine`, distroless) over full image unless a specific package requires it.
- Pin OS package versions in the package manager install command where supported.

## 2. Multi-stage builds (mandatory for compiled/built artifacts)

Any build step (TS compile, bundling, Composer/npm dev deps) → multi-stage: build in one stage, copy only output to a slim final stage. Never ship the build toolchain in production.

```dockerfile
# Stage 1: build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:20-slim AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

Install with a locked command (`npm ci`, `composer install --no-dev --prefer-dist`), never `npm install`/plain `composer install` for production.

## 3. Layer caching

Copy dependency manifests + install BEFORE copying source, so the cache survives source-only changes:

```dockerfile
# Correct
COPY package*.json ./
RUN npm ci
COPY . .
```
```dockerfile
# Wrong — invalidates install cache on every source change
COPY . .
RUN npm ci
```

Combine related `RUN` steps with `&&` (e.g. `apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*`) in one layer. `.dockerignore` MUST exclude `node_modules`, `.git`, `.env*`, build output, test/CI files.

## 4. Security (non-negotiable)

- MUST NOT run as `root`:
  ```dockerfile
  RUN addgroup --system app && adduser --system --ingroup app app
  USER app
  ```
- MUST NEVER bake secrets into the image via `COPY`/`ARG`/hardcoded `ENV` (recoverable from any layer even after later deletion). Pass at runtime: orchestrator env vars, mounted secret files, or BuildKit `--secret` for build-time secrets.
- `ARG` is not a safe place for secrets — visible in image history without BuildKit secret mounts.
- `EXPOSE` only actual ports; one process per container (section 6), no bundled unrelated services.

## 5. Dockerfile hygiene

- `COPY` over `ADD` unless the remote-fetch/auto-extract behavior is specifically needed.
- Comment non-obvious `RUN`/version pins/workarounds.
- Order least-to-most frequently changing (base → system deps → app deps → source) for cache reuse.
- Exec form `CMD ["node", "server.js"]`, not shell form — app becomes PID 1, receives signals correctly.

## 6. Runtime behavior

- MUST handle `SIGTERM` gracefully (finish in-flight work, close connections) within the orchestrator's grace period, or every deploy hard-kills it.
- No native signal/zombie handling (common in Node/PHP) → use `tini`/`--init` as PID 1.
- One primary process per container — don't bundle web server + cron + worker via a supervisor script "for convenience"; split into separate containers. A single-container supervisor is acceptable only as an explicit, called-out exception when the platform can't run multiple containers.
- Logs to `stdout`/`stderr` only — never to an internal file (invisible to log drivers, grows unbounded).

## 7. Health checks & resource limits

`HEALTHCHECK` (or orchestrator readiness/liveness probe) for any long-running service. Explicit CPU/memory limits beyond local throwaway dev.

## 8. docker-compose

- No hardcoded secrets in a committed `docker-compose.yml` — `.env` (gitignored) + `${VARIABLE}`, with `.env.example` for placeholders.
- Bind-mount source for dev hot-reload MUST NOT carry into production — production runs the built image as-is.
- Pin service image versions same as a Dockerfile — no bare `latest`.

## Anti-patterns to avoid

- Dev dependencies installed in the final production stage.
- Single-stage Dockerfile shipping the whole repo/build tools/`.git`.
- `latest` tag beyond local experimentation.
- Running as `root` "for simplicity."
- `COPY .env .env` with real secrets.
- Giant single-layer `RUN` mixing unrelated setup steps.
- Writing persistent app state to the container's own writable layer instead of a volume/external store.
