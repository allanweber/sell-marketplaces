---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-sell-items.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/research/technical-marketplace-integrations-nl-br-research-2026-04-22-174138.md
  - _bmad-output/planning-artifacts/research/market-sell-items-crosslisting-research-2026-04-22.md
workflowType: 'architecture'
project_name: 'sell-items'
user_name: 'Allan'
date: '2026-04-23'
lastStep: 8
status: 'complete'
completedAt: '2026-04-23'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- The system is a “canonical item” cockpit: one internal item becomes multiple per-marketplace channel rows (status + link + next action).
- Publishing is asynchronous and per-channel: user actions enqueue work; outcomes resolve into durable, user-legible states (Publishing/Posted/Action needed/Failed/Not started/Confirmed).
- Assisted channels are first-class but capability-honest: listing package + deep links + resumable checklist, with external URL capture for confirmation.
- Connected channels support in-app operations (MVP anchor: Marktplaats publish + inbox reply), with clear delivery/failure states.
- Close-out is a first-class workflow: mark pending/sold → per-channel checklist (automated where possible, guided where not).
- Operability is part of MVP: troubleshooting panel, trace IDs, audit trail, ops dashboard, and connector degrade/kill-switch.

**Non-Functional Requirements:**
- Reliability: at-least-once background jobs, safe retries, idempotency, durable states across app restarts.
- Privacy/Security (GDPR-aligned): encryption in transit/at rest, strict token handling server-side, metadata-only messaging posture, delete-all workflow, address controls.
- Accessibility: WCAG 2.1 AA for web; keyboard navigation + screen reader support.
- Performance: snappy inventory/detail/inbox loads; publish action returns quickly with queued state.
- Operability: monitoring/alerting for connector error rates, backlog, token failures, sync lag; auditability with trace IDs.
- UX/UI foundation: calm-neutral theme, semantic status colors, “single best next action” CTA everywhere.

**Scale & Complexity:**
- Primary domain: full-stack (mobile + web + backend + async worker + integrations)
- Complexity level: high
- Estimated architectural components: ~12–16 (clients, API, worker, connectors, media, notifications, inbox sync, ops/observability, auth, data/storage)

### Technical Constraints & Dependencies

- Marketplace constraints drive architecture: some channels are API-connected; others must remain Assisted-first (policy-safe).
- All marketplace I/O must be off the request path (queue/worker), with centralized retry/backoff, rate-limit handling, and normalized error mapping.
- Offline-first drafts + queued publishing require a durable state machine and conflict-handling strategy.
- Messaging storage posture is constrained (metadata-only) and must remain capability-honest in UI.

### Cross-Cutting Concerns Identified

- Connector boundary + capability model (Connected vs Assisted) used consistently across backend and clients.
- Status normalization + state machine for publish/sync/message delivery.
- Idempotency + deduplication to prevent duplicate external listings on retries.
- Token lifecycle management (refresh, revocation on delete-all) and secret handling.
- Observability: audit records, trace IDs surfaced to users, dashboards/alerts, and connector degrade controls.
- Accessibility and responsive layout (including two-pane desktop web behavior).

## Starter Template Evaluation

### Primary Technology Domain

Full-stack monorepo (mobile + web + backend/worker + shared packages), aligned to the need for shared types, connector contracts, and consistent capability/status models across platforms.

### Starter Options Considered

- **Turborepo monorepo (Next.js + Expo + shared packages)**: A maintained template that scaffolds a Next.js app, an Expo React Native app, and shared packages in a single repo.
- **Separate starters (Expo + Next.js)**: Initialize mobile and web as separate projects and integrate shared types later (simpler initially, more duplication and drift risk).

### Selected Starter: Turborepo & React Native (Next.js + Expo)

**Rationale for Selection:**
- Enables shared domain types (canonical listing, channel rows, status enums) across mobile/web/worker.
- Keeps connector interfaces and error/status normalization consistent across all surfaces.
- Supports adding a dedicated `worker` app/package for queue processing without splitting repos.

**Initialization Command:**

```bash
npx create-turbo@latest -e with-react-native-web
```

**Architectural Decisions Provided by Starter:**
- **Language & Runtime:** TypeScript across apps/packages.
- **Project structure:** `apps/` (web + native) and shared `packages/` suitable for shared UI/tokens and shared types.
- **DX:** integrated monorepo task running/caching via Turborepo; shared TS configs and formatting conventions.

**Follow-on additions (immediately after init):**
- Add a `worker` app/package for background jobs (publish, retries, token refresh, inbox sync) and a `connectors/` package for marketplace-specific adapters.

## Core Architectural Decisions (Draft)

### Data Architecture (Draft)

- **System of record DB**: PostgreSQL
- **ORM**: Drizzle ORM (stable line; use latest stable and keep current with security fixes)
- **Migrations**: drizzle-kit
- **Queue / background jobs**: BullMQ (Redis-backed) with a dedicated worker app/process in the monorepo
- **Queue backing store**: Redis (managed Redis recommended for production)
- **Schema validation**: Zod for API boundaries (request validation + response shaping), plus DB constraints
- **Idempotency + durability**:
  - Persist publish attempts and outcomes in Postgres (audit trail + trace IDs)
  - Use idempotency keys per listing+marketplace publish intent to prevent duplicate external listings on retries
- **Caching**: defer dedicated caching beyond Redis-for-queues until performance data proves it’s needed (keep query performance as the first lever)

### Authentication & Security (Draft)

- **Auth framework**: Better Auth (TypeScript-first, self-hosted in-app auth)
  - Version policy: pin to latest stable at implementation time; currently the Better Auth changelog shows releases in the `v1.6.x` line (Apr 2026).
- **Web session model**: cookie-based sessions (default Better Auth behavior)
- **Mobile (Expo) session model**: cookie-based sessions stored securely on-device
  - Use `@better-auth/expo` server plugin and `expoClient` on the Expo app.
  - Session/cookies cached in `expo-secure-store` (per Better Auth Expo integration docs).
- **Authenticated API calls from Expo → server**:
  - Retrieve cookie string from `authClient.getCookie()` and set `Cookie` header manually (and use `credentials: "omit"`), per Better Auth Expo docs.
- **Trusted origins / deep links**:
  - Configure `trustedOrigins` to include production app scheme (e.g., `sellitems://*`) and dev Expo `exp://` wildcards only in development.
- **Authorization model (MVP)**:
  - Single-user account scope (no orgs/teams/RBAC in MVP), leaving a path to adopt Better Auth org/roles plugins later if needed.
- **Marketplace tokens & secrets**:
  - Store marketplace OAuth tokens **server-side only**, encrypted at rest.
  - Never place long-lived marketplace tokens in mobile/web clients.
- **GDPR / “delete all”**:
  - Implement user-initiated hard delete for user-owned data (items, photos metadata, addresses, sessions) + revoke marketplace tokens where possible.
  - Keep operational logs with user identifiers minimized/redacted per retention policy.

### API & Communication (Draft)

- **API style**: REST (Next.js route handlers) with an explicit resource-oriented API surface.
- **API documentation**: OpenAPI (keep contracts explicit; generate/host docs in web app and/or export for tooling).
- **Validation**: Zod schemas at request boundaries; map validation failures into a consistent error shape.
- **Error handling standard**:
  - One normalized error envelope across API + worker outcomes (includes `traceId`, `code`, `message`, and optional `details` for field errors).
  - Propagate `traceId` from API request → queued jobs → publish attempts for self-serve troubleshooting.
- **Async job interface**:
  - API endpoints enqueue jobs and return immediate durable states (e.g., `queued/publishing`), with follow-up polling endpoints for per-channel outcomes.
- **Realtime (post-MVP or when needed)**:
  - Prefer SSE/WebSocket for live status updates; polling fallback remains supported.

### Frontend Architecture (Draft)

- **Routing**
  - **Web**: Next.js App Router (from starter / Next.js default)
  - **Mobile**: Expo Router (from starter / Expo default)
- **Server state / data fetching**: TanStack Query
  - Inventory, item detail, inbox views use query caching + background refetch to keep “cockpit” fresh.
  - Mutations update durable per-item/per-channel statuses (optimistic updates only where safe).
- **Client/UI state**: Zustand
  - Filters/sorts, selected item/conversation (two-pane web), draft form UI state, and ephemeral UX flags.
- **Offline-first drafts**
  - Draft edits stored locally first and synced to server when online.
  - Photos captured offline are queued for upload; publish intents are queued and executed when connectivity returns (with clear user-visible state).
  - **Local/offline libraries (explicit)**:
    - **Mobile (Expo)**: `expo-sqlite` for drafts + outbox tables, `expo-file-system` for photo files, and `expo-network` for connectivity detection.
    - **Web (Next.js)**: IndexedDB via `dexie` for drafts + outbox tables.
- **Cross-platform UI system**
  - Mobile uses React Native Paper as the foundation (per UX spec).
  - Web uses a Material-aligned component set and shared design tokens to maintain parity.

### Infrastructure & Deployment (Draft)

- **Hosting**: self-host on Hetzner VPS using Dokploy
  - Deploy separate processes/apps for: `web` (Next.js), `native` (Expo dev/build pipeline + distribution handled separately), and `worker` (BullMQ consumers).
- **CI/CD**: GitHub Actions (build, test, deploy via Dokploy)
- **Database**: self-hosted Postgres on the VPS (or managed later if desired)
- **Queue backend**: self-hosted Redis on the VPS (BullMQ)
- **Object storage (photos)**: Cloudflare R2
- **Monitoring / error tracking**
  - Default: Sentry (hosted) is acceptable.
  - **Self-hosted open-source suggestions** (Sentry-protocol compatible):
    - **GlitchTip** (drop-in Sentry SDK compatible; lower ops than self-hosting Sentry)
    - **Bugsink** (minimal footprint; Sentry SDK compatible)
  - Metrics/logs (optional next layer): OpenTelemetry + Grafana stack (Prometheus/Loki/Tempo) if you want fuller observability later.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 12 areas where AI agents could make different choices (naming, structure, formats, jobs, and error handling)

### Naming Patterns

**Database Naming Conventions (Drizzle/Postgres):**
- Tables: `snake_case` plural (e.g., `users`, `items`, `marketplace_accounts`, `publish_attempts`)
- Columns: `snake_case` (e.g., `user_id`, `created_at`, `external_url`)
- Primary keys: `id` (UUID recommended)
- Foreign keys: `{ref}_id` (e.g., `item_id`, `marketplace_account_id`)
- Timestamps: `created_at`, `updated_at`, optional `deleted_at`
- Enums: `snake_case` values stored as text (or DB enum later), but **code enums** are `PascalCase`

**API Naming Conventions (REST):**
- Base: `/api`
- Resources are plural nouns: `/api/items`, `/api/items/{itemId}`
- Nested resources: `/api/items/{itemId}/channels`, `/api/items/{itemId}/publish`
- IDs in path are always `{thingId}` (camelCase in OpenAPI path params)
- Query params: `camelCase` (e.g., `state=actionNeeded`, `marketplace=marktplaats`)
- Headers:
  - `x-trace-id` (request/response)
  - `x-client` (optional; `web|mobile|worker`)

**Code Naming Conventions:**
- TypeScript: `camelCase` variables/functions, `PascalCase` types/classes/components
- Files: `kebab-case.ts` / `kebab-case.tsx` for most modules; React components may use `PascalCase.tsx` if preferred, but pick one and keep consistent (recommend: `kebab-case.tsx`)
- Domain types live in a shared package and are imported consistently

### Structure Patterns

**Monorepo Organization (Turborepo):**
- `apps/web`: Next.js app (UI + API route handlers)
- `apps/native`: Expo app
- `apps/worker`: BullMQ workers (no Next.js; plain Node runtime)
- `packages/domain`: shared domain types + Zod schemas (canonical item, channel row, statuses, error envelope)
- `packages/connectors`: marketplace connector implementations + mapping/validation helpers
- `packages/ui`: shared design tokens + cross-platform UI primitives (keep minimal early)

**Tests:**
- Co-locate unit tests next to modules: `*.test.ts`
- Integration tests under `apps/web/tests/` and `apps/worker/tests/` as needed

### Format Patterns

**API Response Envelope (always):**
- Success:
  - `{ "data": <payload>, "traceId": "<id>" }`
- Error:
  - `{ "error": { "code": "<CODE>", "message": "<human>", "details": <optional> }, "traceId": "<id>" }`

**Data exchange casing rule:**
- API JSON is `camelCase`
- DB is `snake_case`
- Mapping happens at repository boundary (DB ↔ domain), never scattered across handlers

**Date/Time:**
- API uses ISO-8601 strings in UTC (e.g., `2026-04-23T12:34:56Z`)

### Communication Patterns

**Job/Event Naming (BullMQ):**
- Queue names: `publish`, `sync`, `notifications`
- Job names: `publish.item`, `publish.channel`, `sync.inbox`, `tokens.refresh`
- Job payloads always include:
  - `traceId`
  - `userId`
  - `itemId` (if applicable)
  - `channel` / `marketplace` (if applicable)
  - `idempotencyKey` (for publish)

**Idempotency + retries:**
- Only worker performs marketplace I/O
- Worker retries only transient failures; permanent validation failures become `actionNeeded`

### Process Patterns

**Trace ID propagation (must-have):**
- Generate `traceId` per incoming API request if absent
- Pass `traceId` into:
  - DB audit rows (`publish_attempts.trace_id`)
  - BullMQ job data
  - All logs for that flow
- Return `traceId` in API response and surface it in the UX troubleshooting panel

**Error handling:**
- Never throw raw connector errors to clients
- Map to normalized error codes (e.g., `VALIDATION_MISSING_FIELD`, `AUTH_EXPIRED`, `RATE_LIMITED`, `PROVIDER_DOWN`)
- User-facing messages are calm and actionable; debug detail stays server-side (or in support bundle)

**Loading states (UX rule):**
- Use the durable status language everywhere:
  - `publishing`, `posted`, `actionNeeded`, `failed`, `notStarted`, `confirmed`

### Enforcement Guidelines

**All AI Agents MUST:**
- Put shared domain types + Zod schemas in `packages/domain` (no local copies)
- Use the standard API envelope + standard error codes
- Include `traceId` in every API response and every BullMQ job payload
- Keep all marketplace I/O inside `apps/worker` via `packages/connectors`

**Pattern enforcement:**
- CI checks: lint + typecheck + unit tests
- PR checklist item: “No duplicated domain types; API envelope unchanged; traceId present”

### Anti-Patterns (avoid)

- Calling marketplaces from Next.js route handlers (request path)
- Inconsistent casing (snake_case JSON responses or camelCase DB columns)
- Multiple incompatible “error formats”
- Storing marketplace tokens in the Expo/web app

## Project Structure & Boundaries

### Complete Project Directory Structure

```
sell-items/
├── README.md
├── .gitignore
├── .env.example
├── turbo.json
├── package.json
├── pnpm-workspace.yaml                # (or npm/yarn workspace equivalent)
├── apps/
│   ├── web/                           # Next.js (UI + REST API)
│   │   ├── package.json
│   │   ├── next.config.*
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── sign-in/page.tsx
│   │   │   │   │   └── sign-up/page.tsx
│   │   │   │   ├── (app)/
│   │   │   │   │   ├── inventory/page.tsx
│   │   │   │   │   ├── inbox/page.tsx
│   │   │   │   │   └── items/[itemId]/page.tsx
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth/[...all]/route.ts          # Better Auth Next.js handler mount
│   │   │   │   │   ├── health/route.ts
│   │   │   │   │   ├── openapi/route.ts                # serves OpenAPI JSON
│   │   │   │   │   ├── items/route.ts                  # list/create items
│   │   │   │   │   ├── items/[itemId]/route.ts         # get/update item
│   │   │   │   │   ├── items/[itemId]/publish/route.ts # enqueue publish jobs
│   │   │   │   │   ├── inbox/route.ts                  # connected inbox summary
│   │   │   │   │   └── ops/route.ts                    # minimal ops/health endpoints
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── cockpit/
│   │   │   │   ├── inbox/
│   │   │   │   └── items/
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts                             # Better Auth instance config (server)
│   │   │   │   ├── db.ts                               # Postgres connection
│   │   │   │   ├── repos/                              # DB ↔ domain mapping lives here
│   │   │   │   ├── services/                           # orchestration: enqueue jobs, etc.
│   │   │   │   ├── openapi.ts                          # OpenAPI generation/registry
│   │   │   │   ├── errors.ts                           # error normalization + codes
│   │   │   │   └── trace.ts                            # traceId generation/propagation
│   │   │   └── middleware.ts                           # optional: traceId header, auth gating
│   │   └── tests/
│   │       ├── integration/
│   │       └── e2e/
│   ├── native/                        # Expo (mobile)
│   │   ├── package.json
│   │   ├── app.json                    # scheme config (deep links)
│   │   ├── app/
│   │   │   ├── (auth)/sign-in.tsx
│   │   │   ├── (auth)/sign-up.tsx
│   │   │   ├── (tabs)/inventory.tsx
│   │   │   ├── (tabs)/inbox.tsx
│   │   │   ├── (tabs)/new-item.tsx
│   │   │   └── items/[itemId].tsx
│   │   ├── lib/
│   │   │   ├── auth-client.ts           # Better Auth Expo client plugin + SecureStore
│   │   │   ├── api.ts                   # fetch wrapper adds Cookie header from authClient.getCookie()
│   │   │   ├── offline/
│   │   │   │   ├── sqlite.ts            # expo-sqlite db init
│   │   │   │   ├── drafts.repo.ts       # local drafts CRUD
│   │   │   │   ├── outbox.repo.ts       # queued operations
│   │   │   │   └── sync.ts              # sync engine (online detection via expo-network)
│   │   │   └── uploads/
│   │   │       ├── filesystem.ts        # expo-file-system helpers
│   │   │       └── photo-queue.ts
│   │   └── components/
│   │       ├── cockpit/
│   │       ├── inbox/
│   │       └── items/
│   └── worker/                         # BullMQ workers (ALL marketplace I/O)
│       ├── package.json
│       └── src/
│           ├── index.ts                # worker entry
│           ├── queues/
│           │   ├── publish.ts
│           │   ├── sync.ts
│           │   └── notifications.ts
│           ├── jobs/
│           │   ├── publish.item.ts
│           │   ├── publish.channel.ts
│           │   ├── sync.inbox.ts
│           │   └── tokens.refresh.ts
│           ├── lib/
│           │   ├── db.ts               # Postgres connection (same schema)
│           │   ├── redis.ts            # Redis connection
│           │   ├── trace.ts            # traceId helper
│           │   ├── errors.ts           # normalized codes (shared)
│           │   └── idempotency.ts
│           └── services/
│               ├── publish-orchestrator.ts
│               ├── inbox-sync.ts
│               └── token-refresh.ts
├── packages/
│   ├── domain/                         # shared types + Zod schemas (single source of truth)
│   │   ├── package.json
│   │   └── src/
│   │       ├── ids.ts
│   │       ├── statuses.ts             # publishing/posted/actionNeeded/failed/notStarted/confirmed
│   │       ├── errors.ts               # error codes + envelope types
│   │       ├── item.ts                 # canonical item schema
│   │       ├── channel.ts              # channel row schema, capability flags
│   │       ├── publish-attempt.ts
│   │       └── openapi.ts              # shared OpenAPI schema fragments (optional)
│   ├── connectors/                     # marketplace adapters (no network calls outside worker)
│   │   ├── package.json
│   │   └── src/
│   │       ├── contract.ts             # connector interface
│   │       ├── common/
│   │       │   ├── mapping.ts
│   │       │   ├── retry.ts
│   │       │   └── rate-limit.ts
│   │       ├── marktplaats/
│   │       ├── facebook-assisted/      # listing package + deep links + URL confirm helper
│   │       └── ebay/                   # post-MVP optional
│   ├── db/                             # Drizzle schema + migrations (shared by web/worker)
│   │   ├── package.json
│   │   ├── drizzle.config.ts
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.ts
│   │   │   │   ├── items.ts
│   │   │   │   ├── marketplace-accounts.ts
│   │   │   │   ├── publish-attempts.ts
│   │   │   │   └── inbox.ts
│   │   │   └── index.ts
│   │   └── migrations/
│   └── ui/                             # tokens + shared components (keep minimal early)
│       ├── package.json
│       └── src/
│           ├── tokens/
│           └── primitives/
└── .github/
    └── workflows/
        ├── ci.yml                      # lint/typecheck/test
        └── deploy.yml                  # dokploy deploy
```

### Architectural Boundaries

**API Boundaries (apps/web):**
- Only `apps/web` serves HTTP REST endpoints.
- `apps/web` may enqueue BullMQ jobs, but must not call marketplace APIs directly.
- Auth is mounted at `apps/web/src/app/api/auth/[...all]/route.ts`.

**Component Boundaries (UI):**
- UI components live in `apps/web/src/components` and `apps/native/components`.
- Shared tokens/primitives (if any) live in `packages/ui`.
- Two-pane web state (selected item/conversation) is Zustand in `apps/web`.

**Service Boundaries:**
- Marketplace connectors live in `packages/connectors`.
- Marketplace I/O happens only in `apps/worker`.
- Business orchestration lives in `apps/web/src/lib/services` (enqueue + state) and `apps/worker/src/services` (execute + persist outcomes).

**Data Boundaries:**
- Drizzle schema + migrations are centralized in `packages/db`.
- DB ↔ domain mapping lives in repositories (`apps/web/src/lib/repos`, `apps/worker/src/lib/*`).
- API JSON is camelCase; DB is snake_case.

### Requirements to Structure Mapping (FR categories → locations)

- **Account & User Management (FR1–FR5)**:
  - Web API: `apps/web/src/app/api/auth/**`, `apps/web/src/lib/auth.ts`
  - Mobile client: `apps/native/lib/auth-client.ts`
  - Domain: `packages/domain/*`
- **Channels (FR6–FR10)**:
  - Domain: `packages/domain/channel.ts`
  - Connectors: `packages/connectors/*`
  - Worker jobs: `apps/worker/src/jobs/publish.channel.ts`, `apps/worker/src/services/*`
- **Canonical Item CRUD (FR11–FR17)**:
  - Web API routes: `apps/web/src/app/api/items/**`
  - Mobile UI: `apps/native/app/(tabs)/new-item.tsx`, `apps/native/app/items/[itemId].tsx`
  - Domain: `packages/domain/item.ts`
  - DB schema: `packages/db/src/schema/items.ts`
- **Publishing & Cross-post (FR21–FR27)**:
  - Enqueue: `apps/web/src/app/api/items/[itemId]/publish/route.ts`
  - Execute: `apps/worker/src/jobs/publish.*`
  - Persist: `packages/db/src/schema/publish-attempts.ts`
- **Inventory Cockpit (FR31–FR34 + FR56)**:
  - Web UI: `apps/web/src/app/(app)/inventory/page.tsx`, `apps/web/src/components/cockpit/*`
  - Mobile UI: `apps/native/app/(tabs)/inventory.tsx`
- **Inbox (FR35–FR40)**:
  - Web UI: `apps/web/src/app/(app)/inbox/page.tsx`
  - Worker: `apps/worker/src/jobs/sync.inbox.ts`
  - Storage: `packages/db/src/schema/inbox.ts`
- **Offline drafts/sync (FR18–FR20 + offline NFRs)**:
  - Mobile: `apps/native/lib/offline/**` + `expo-sqlite` + `expo-file-system`
  - Web: `dexie` layer under `apps/web/src/lib/offline/**` (to be created when web offline is implemented)

### Integration Points

**Internal Communication:**
- `apps/web` → BullMQ queues (Redis) → `apps/worker`
- `apps/worker` → Postgres (durable state + audit) → `apps/web` reads for UI

**External Integrations:**
- Better Auth: cookie sessions, Expo plugin, trusted origins configured
- Cloudflare R2: photo object storage (upload flow defined in API + worker if needed)
- Marketplace APIs: only through `packages/connectors` invoked by `apps/worker`

**Data Flow (publish):**
1. UI triggers publish → REST endpoint enqueues job + returns `publishing`
2. Worker executes connector → persists `publish_attempt` with outcome + `traceId`
3. UI polls (or later SSE/WS) to reflect per-channel status

### File Organization Patterns

**Configuration files:**
- Root: workspace + CI + env examples
- `packages/db/drizzle.config.ts` is the single migration config

**Source organization:**
- Shared types only in `packages/domain`
- Connectors only in `packages/connectors`
- Worker-only I/O rule enforced by convention + code review

**Test organization:**
- Unit tests co-located
- Integration tests under `apps/*/tests/integration`

### Development Workflow Integration

- `apps/web`: runs Next.js dev server
- `apps/native`: runs Expo dev server
- `apps/worker`: runs BullMQ workers (dev against local Redis/Postgres)
- Dokploy deploys `apps/web` + `apps/worker` as separate services on the VPS

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- Turborepo monorepo + Next.js REST/OpenAPI + Better Auth (cookie sessions) + Drizzle/Postgres + BullMQ/Redis are compatible.
- Offline strategy (Expo SQLite + FileSystem; web Dexie) matches offline-first requirements without overloading app state tooling.
- Worker-only marketplace I/O boundary aligns with reliability and policy constraints.

**Pattern Consistency:**
- Naming rules (DB snake_case vs API camelCase) are consistent with repo boundaries.
- Trace ID propagation is consistently required across API → jobs → audit → UX troubleshooting.
- Error envelope and job naming conventions are coherent.

**Structure Alignment:**
- Project tree supports clear ownership: web serves HTTP, worker executes external I/O, packages hold shared domain/connectors/db.
- Requirements-to-structure mapping is complete and usable by implementation agents.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
- All major FR categories have clear architectural homes (items, publish, inventory, inbox, ops, troubleshooting).
- Connected vs Assisted capability model is supported in domain + connectors + UI patterns.

**Non-Functional Requirements Coverage:**
- Reliability: async jobs + retries + idempotency + durable state modeled.
- Security/Privacy: server-side tokens only; delete-all requirement called out.
- Accessibility and UX status language included in patterns.

### Implementation Readiness Validation ✅

**Decision Completeness:**
- Core stack decisions are set, but OpenAPI toolchain and encryption/key management approach should be pinned down.

**Structure Completeness:**
- Directory structure is concrete and boundaries are explicit.

**Pattern Completeness:**
- Patterns cover the highest-risk agent divergence points (naming, envelope, traceId, worker-only I/O).

### Gap Analysis Results

**Critical gaps (decide now):**
- OpenAPI implementation toolchain choice
- Secret management + encryption-at-rest strategy (VPS)

**Important gaps (decide soon):**
- Postgres/Redis backup & restore plan
- R2 upload strategy (presigned vs proxy; resizing location)
- API and worker rate limiting strategy
- Realtime update strategy (SSE vs WebSocket first)

**Nice-to-have:**
- Canonical error code enum list
- Explicit status transition table for per-channel states

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION (with the critical gaps above addressed)  
**Confidence Level:** High

**First Implementation Priority:**
- Initialize monorepo from starter:
  - `npx create-turbo@latest -e with-react-native-web`
- Add `apps/worker`, `packages/domain`, `packages/db`, `packages/connectors` scaffolding per structure rules.
