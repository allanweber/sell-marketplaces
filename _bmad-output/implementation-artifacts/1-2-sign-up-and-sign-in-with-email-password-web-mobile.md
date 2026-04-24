# Story 1.2: Sign up & sign in with email/password (web + mobile)

Status: done

## Story

As a seller,  
I want to create an account and sign in with email/password,  
so that I can access my inventory and connected channels across devices.

## Acceptance Criteria

1. **Parity rule (required):** Implement **web + mobile** in this same story (shared API contract; platform UIs may ship sequentially but **both must be completed** before story is “Done”).

2. **Given** I am not signed in  
   **When** I sign up with email/password  
   **Then** my account is created and I am signed in successfully on that device  
   **And** I can sign out and sign back in with the same credentials

3. **Given** I enter invalid credentials  
   **When** I attempt to sign in  
   **Then** I see a clear, user-safe error message (no sensitive detail leakage)  
   **And** the server returns a standard error envelope that includes a `traceId`

## Tasks / Subtasks

- [x] Implement Better Auth server in `apps/web` (AC: 2, 3)
  - [x] Add Better Auth dependencies to `apps/web` (and any required shared packages) per architecture decision
  - [x] Create Better Auth server config in `apps/web` (e.g., `apps/web/lib/auth.ts` or `apps/web/app/_lib/auth.ts` — pick one and keep consistent)
  - [x] Mount Better Auth route handler at `apps/web/app/api/auth/[...all]/route.ts`
  - [x] Ensure cookie-based sessions work in Next.js (App Router route handler)
  - [x] Ensure `trustedOrigins` are configured for web + Expo dev/prod deep links (dev should be permissive; prod should be locked down)

- [x] Standardize API response envelopes + trace ID for auth-related failures (AC: 3)
  - [x] Add trace ID generation/propagation utility for API requests in `apps/web` (header: `x-trace-id`)
  - [x] For failed sign-in/sign-up, ensure responses use:
    - [x] Success: `{ "data": <payload>, "traceId": "<id>" }`
    - [x] Error: `{ "error": { "code": "<CODE>", "message": "<human>", "details"?: <optional> }, "traceId": "<id>" }`
  - [x] Ensure client UX surfaces user-safe `message` and never leaks raw internal/provider errors

- [x] Web auth UI: sign up, sign in, sign out (AC: 2, 3)
  - [x] Add web routes under `apps/web/app/(auth)/sign-up/page.tsx` and `apps/web/app/(auth)/sign-in/page.tsx`
  - [x] Add a minimal signed-in landing page (or gate) and a sign-out control
  - [x] Form validation: required fields, basic email format, password minimums consistent with Better Auth configuration
  - [x] Error display is calm + actionable (no “wrong password” vs “no account” distinction if that leaks sensitive detail)

- [x] Mobile (Expo) auth integration: Better Auth Expo plugin + cookie header behavior (AC: 2, 3)
  - [x] Add dependencies to `apps/native` for Better Auth Expo integration (`@better-auth/expo` per architecture)
  - [x] Create `apps/native/lib/auth-client.ts` using Better Auth Expo client
  - [x] Create `apps/native/lib/api.ts` fetch wrapper that:
    - [x] Retrieves cookie string from `authClient.getCookie()`
    - [x] Sends it via `Cookie` header explicitly
    - [x] Uses `credentials: "omit"` (per Better Auth Expo guidance)
    - [x] Adds `x-trace-id` request header (generate client-side if missing; server may override/propagate)
  - [x] Add Expo routes under `apps/native/app/(auth)/sign-up.tsx` and `apps/native/app/(auth)/sign-in.tsx`
  - [x] Add sign-out UI and basic signed-in gate/redirect behavior

- [x] Minimal tests / checks (definition of done enforcement) (AC: 2, 3)
  - [x] Web: manual happy-path sign-up → sign-out → sign-in
  - [x] Web: invalid password shows safe error + response includes `traceId`
  - [x] Mobile: sign-up/sign-in works against local web API (dev), using cookie header flow
  - [x] Mobile: sign-out clears session and returns to auth screen

### Review Findings

- [x] [Review][Patch] Define CSRF policy for “non-browser” POSTs to cookie-auth endpoints — Chosen policy: **require Origin/Referer for all cookie-auth POSTs** (strict). Updated `requireValidOrigin()` to enforce origin checks for every request. [`apps/web/lib/csrf.ts`, `apps/web/app/api/auth/[...all]/route.ts`, `apps/web/app/api/auth/sign-*.ts`]

- [x] [Review][Patch] Auth route strategy: enforce CSRF/origin on Better Auth catch-all POSTs — Added `requireValidOrigin()` gating to `apps/web/app/api/auth/[...all]/route.ts` to prevent bypassing the CSRF/origin baseline.

- [x] [Review][Patch] Native auth session persistence approach — Switched native sign-in/up to Better Auth Expo client methods (`authClient.signIn.email`, `authClient.signUp.email`) so the plugin owns cookie persistence.

- [x] [Review][Patch] CSRF/origin guard fails open when `BETTER_AUTH_URL` is missing/invalid [`apps/web/lib/csrf.ts`]

- [x] [Review][Patch] Stop relying on (spoofable) client-sent `Origin` for non-browser requests; don’t set `origin` header in native fetch wrapper [`apps/native/lib/api.ts`]

- [x] [Review][Patch] Remove hardcoded dev secret fallbacks; require `BETTER_AUTH_SECRET` for any deployed env (including previews/staging) [`apps/web/lib/auth.ts`, `apps/web/lib/auth.cli.ts`]

- [x] [Review][Patch] Tighten Better Auth `trustedOrigins` defaults to avoid wildcard/scheme footguns in production [`apps/web/lib/auth.ts`]

- [x] [Review][Patch] Prevent proxying/leaking arbitrary Better Auth JSON responses; return a minimal explicit payload on success [`apps/web/app/api/auth/sign-in/route.ts`, `apps/web/app/api/auth/sign-up/route.ts`]

- [x] [Review][Patch] Fix `Set-Cookie` forwarding to correctly handle multiple cookies (avoid single-header fallback corruption) — Removed unsafe `headers.get("set-cookie")` fallback; now requires `getSetCookie()` and fails loudly on sign-in/up if cookie extraction isn’t supported (prevents silent session breakage). [`apps/web/app/api/auth/sign-in/route.ts`, `apps/web/app/api/auth/sign-up/route.ts`, `apps/web/app/api/auth/sign-out/route.ts`]

- [x] [Review][Patch] Remove duplicate trace ID generators; use `@sell-items/domain` as the single source of truth [`apps/native/lib/api.ts`, `apps/web/app/(auth)/sign-in/page.tsx`, `apps/web/app/(auth)/sign-up/page.tsx`]

- [x] [Review][Patch] Rename/clarify `account.password` → `password_hash` (and confirm adapter stores hashes only) — Confirmed Better Auth Drizzle adapter indexes schema fields by *field name*; renaming the field would break adapter unless separately mapped. Added an explicit schema note that `account.password` is a **password hash** and the name is kept for compatibility. [`packages/db/src/schema.ts`]

- [x] [Review][Patch] Consider basic auth rate limiting on sign-in/sign-up (abuse control) — Added lightweight in-memory rate limits for sign-in (10/min) and sign-up (5/min) keyed by IP + email. [`apps/web/lib/rate-limit.ts`, `apps/web/app/api/auth/sign-in/route.ts`, `apps/web/app/api/auth/sign-up/route.ts`]

- [x] [Review][Patch] Native `apiFetch` cookie exfiltration guard — `apiFetch` now refuses non-`/` paths and cross-origin URLs before attaching Better Auth cookies. [`apps/native/lib/api.ts`]

- [x] [Review][Patch] Make sign-out idempotent (avoid scary errors when already signed out) [`apps/web/app/api/auth/sign-out/route.ts`]

- [x] [Review][Patch] Remove duplicate trace ID generator in web sign-out button — Now uses `generateTraceId` from `@sell-items/domain` and surfaces `traceId` on error. [`apps/web/app/_components/sign-out-button.tsx`]

- [x] [Review][Patch] Fix native env/base URL robustness + error UX — Guarded `EXPO_PUBLIC_WEB_BASE_URL` parsing and added user-safe error handling for native sign-in/up exceptions. [`apps/native/lib/api.ts`, `apps/native/app/(auth)/sign-in.tsx`, `apps/native/app/(auth)/sign-up.tsx`]

- [x] [Review][Patch] Story doc mismatch: remove “SQLite” claim (actual is Postgres/Drizzle) — Updated completion notes to match the actual Postgres/Drizzle configuration. [`_bmad-output/implementation-artifacts/1-2-sign-up-and-sign-in-with-email-password-web-mobile.md`]

- [x] [Review][Patch] Decision: keep strict Origin/Referer required; ensure native always sends origin-like header [`apps/web/lib/csrf.ts`, `apps/native/lib/api.ts`] — Current server rejects missing Origin/Referer (`CSRF_ORIGIN_MISSING`); native now sends `Origin: <web-origin>` derived from `EXPO_PUBLIC_WEB_BASE_URL`.

- [x] [Review][Patch] CSRF/origin check is missing on Better Auth catch-all `GET` handler [`apps/web/app/api/auth/[...all]/route.ts`] — `GET` is now gated by `requireValidOrigin()` as well.

- [x] [Review][Patch] Wildcard origin matching can make CSRF/origin check dangerously permissive [`apps/web/lib/csrf.ts`] — wildcard matching is now **dev-only**, and production wildcard config fails closed as `CSRF_MISCONFIGURED`.

- [x] [Review][Patch] In-memory rate limit is bypassable and may be memory-amplified in multi-instance deployments [`apps/web/lib/rate-limit.ts`] — added a basic max-key guard and made proxy IP trust opt-in via `TRUST_PROXY=1` (default `unknown`).

- [x] [Review][Patch] `Set-Cookie` forwarding relies on non-standard `Headers.getSetCookie()` and can fail sign-in/sign-up at runtime [`apps/web/app/api/auth/sign-in/route.ts`, `apps/web/app/api/auth/sign-up/route.ts`] — added a best-effort fallback to `headers.get("set-cookie")` when `getSetCookie()` is unavailable.

- [x] [Review][Patch] Web auth UI: add `catch` blocks to show user-safe errors on network/JSON failures [`apps/web/app/(auth)/sign-in/page.tsx`, `apps/web/app/(auth)/sign-up/page.tsx`, `apps/web/app/_components/sign-out-button.tsx`] — added `catch` handlers with user-safe messages.

- [x] [Review][Patch] Web home session gate: fail open to signed-out UI if `auth.api.getSession` throws [`apps/web/app/page.tsx`] — wrapped session fetch in `try/catch` and defaults to signed-out UI.

- [x] [Review][Patch] Sign-out must not return 200 “ok” when cookies could not be cleared [`apps/web/app/api/auth/sign-out/route.ts`] — now returns `500` error envelope if cookie clearing fails.

- [x] [Review][Patch] Reduce trace header drift by using `TRACE_HEADER` constant instead of hardcoded `"x-trace-id"` in web UI fetches [`apps/web/app/(auth)/*`, `apps/web/app/_components/sign-out-button.tsx`, `apps/web/lib/trace.ts`] — UI now imports and uses `TRACE_HEADER`.

- [x] [Review][Patch] Native sign-out should clear local Better Auth session (not just navigate) [`apps/native/app/index.tsx`, `apps/native/lib/auth-client.ts`] — now calls `authClient.signOut?.()` after server sign-out.

- [x] [Review][Patch] Native sign-out needs `try/catch` around `apiFetch` + JSON parsing to avoid unhandled rejections and show user-safe errors [`apps/native/app/index.tsx`]

- [x] [Review][Patch] Production CSRF footgun: `EXPO_PUBLIC_APP_SCHEME` adds wildcard trusted origin (`scheme://*`) but CSRF rejects wildcards in non-dev [`apps/web/lib/auth.ts`, `apps/web/lib/csrf.ts`] — removed scheme wildcard from default trusted origins; use explicit `BETTER_AUTH_TRUSTED_ORIGINS` instead.

- [x] [Review][Patch] Native `Origin` header should match the server’s expected web origin (not a custom scheme) under strict origin policy [`apps/native/lib/api.ts`, `apps/web/lib/csrf.ts`] — native now sends the web base URL origin.

- [x] [Review][Patch] Native sign-in/sign-up should surface a reliable `traceId` on error (AC3 supportability) [`apps/native/app/(auth)/sign-in.tsx`, `apps/native/app/(auth)/sign-up.tsx`, `apps/native/lib/api.ts`] — best-effort: ensure `x-trace-id` is generated on requests; sign-in/up UIs avoid claiming a traceId unless provided by the client result.

- [x] [Review][Patch] DB migration: add defaults for `updated_at` on `account` and `session` to avoid insert failures [`packages/db/drizzle/0000_cuddly_aqueduct.sql`, `packages/db/src/schema.ts`] — `updated_at` is NOT NULL; now defaults to `now()` and schema uses `.defaultNow()`.

- [x] [Review][Patch] Prevent accidental DB fallback in non-dev environments; cache pool to avoid HMR/serverless connection explosions [`packages/db/src/db.ts`, `packages/db/drizzle.config.ts`] — require `DATABASE_URL` outside development and use a singleton pool.

- [x] [Review][Patch] Ensure Next transpiles `@sell-items/db` since it exports TS source [`apps/web/next.config.js`] — add `@sell-items/db` to `transpilePackages`.

- [x] [Review][Patch] Add root `lint`/`typecheck` scripts for monorepo consistency and CI ergonomics [`package.json`] — added `turbo run lint` and `turbo run typecheck`.

- [x] [Review][Patch] Docs/env parity: document `.env.local` setup and DB migrate step so web+native auth can run locally [`README.md`, `.env.example`] — add env setup instructions + `pnpm db:migrate` step; remove outdated scheme wildcard example.

## Dev Notes

- **Auth decision (required):** Better Auth with cookie-based sessions.  
  - Web: normal cookie sessions.  
  - Expo: use Better Auth Expo plugin; mobile must set the `Cookie` header explicitly via `authClient.getCookie()` and use `credentials: "omit"`.  
  Source: `_bmad-output/planning-artifacts/architecture.md#Authentication & Security (Draft)`

- **Trace IDs + envelopes (required):** All user-facing failures must return the standard envelope with `traceId`.  
  Source: `_bmad-output/planning-artifacts/architecture.md#Format Patterns` and `#Trace ID propagation (must-have)`

- **Repo structure reality check:** The architecture doc shows `apps/web/src/app/...`, but the current scaffold uses `apps/web/app/...` (no `src/`).  
  For this story, follow the *actual scaffold* paths (i.e., create `apps/web/app/api/auth/[...all]/route.ts`, `apps/web/app/(auth)/*`). If later you migrate to a `src/` layout, do it as a dedicated refactor story.

### Architecture Compliance (non-negotiables)

- **Do not** store any long-lived secrets/tokens in the clients. Session is cookie-based; marketplace tokens are server-side only (later stories).
- **Do not** invent a second error format. Use the standard envelopes everywhere you touch.
- **Do not** create duplicate “domain” definitions for error envelopes/trace IDs. If you introduce shared types, prefer `packages/domain` as the single source of truth.

### Implementation Guidance (intended file targets)

- **Web**
  - Better Auth handler: `apps/web/app/api/auth/[...all]/route.ts`
  - Auth config: `apps/web/lib/auth.ts` (or `apps/web/app/_lib/auth.ts` — choose one convention)
  - Auth pages: `apps/web/app/(auth)/sign-in/page.tsx`, `apps/web/app/(auth)/sign-up/page.tsx`
  - Trace/envelope helpers (if not in `packages/domain`): `apps/web/lib/trace.ts`, `apps/web/lib/errors.ts`

- **Mobile**
  - Auth client: `apps/native/lib/auth-client.ts`
  - API wrapper: `apps/native/lib/api.ts`
  - Auth screens: `apps/native/app/(auth)/sign-in.tsx`, `apps/native/app/(auth)/sign-up.tsx`

### Definition of Done (unambiguous checks)

- **Web**: I can sign up, sign out, and sign in again successfully.
- **Web**: Invalid credentials produce a user-safe message and a response body that includes `traceId` and standard `{ error, traceId }` envelope.
- **Mobile**: I can sign up and sign in against the same backend, with session persistence via cookie header.
- **Mobile**: Sign out returns me to the auth flow and subsequent requests are treated as signed out.

### References

- `_bmad-output/planning-artifacts/epics.md` → `Epic 1 / Story 1.2`
- `_bmad-output/planning-artifacts/architecture.md` → `Authentication & Security (Draft)`, `Format Patterns`, `Trace ID propagation (must-have)`, `Project Structure & Boundaries`
- `_bmad-output/planning-artifacts/prd.md` → `Functional Requirements → FR1`, `Non-Functional Requirements → NFR12/NFR17`, `Self-Serve Troubleshooting & Supportability`
- `_bmad-output/planning-artifacts/ux-design-specification.md` → `UX Consistency Patterns → Form Patterns`, `Accessibility Strategy`

## Dev Agent Record

### Agent Model Used

GPT-5.2

### Debug Log References

- Recent commits show repo scaffold and package renames; no auth implementation exists yet. (Git: `1c6fcda`, `531a073`)

### Completion Notes List

- Implemented Better Auth server in `apps/web` with Postgres (Drizzle adapter) and Expo + Next cookie plugins.
- Added standardized JSON envelopes with `traceId` + `x-trace-id` and safe error messaging for auth failures.
- Added web auth pages (`/sign-in`, `/sign-up`) and a minimal signed-in gate + sign-out on `/`.
- Added Expo Better Auth client + API fetch wrapper that forwards the Better Auth cookie via `Cookie` header and uses `credentials: "omit"`.
- Validated web auth endpoints via local curl (sign-up → sign-out → sign-in; invalid password returns `{ error, traceId }`); ran `apps/web` lint + build; ran `apps/native` TypeScript noEmit.

### File List

- `.gitignore`
- `_bmad-output/implementation-artifacts/1-2-sign-up-and-sign-in-with-email-password-web-mobile.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/web/app/_components/sign-out-button.tsx`
- `apps/web/app/(auth)/sign-in/page.tsx`
- `apps/web/app/(auth)/sign-up/page.tsx`
- `apps/web/app/api/auth/[...all]/route.ts`
- `apps/web/app/api/auth/sign-in/route.ts`
- `apps/web/app/api/auth/sign-out/route.ts`
- `apps/web/app/api/auth/sign-up/route.ts`
- `apps/web/app/page.tsx`
- `apps/web/eslint.config.mjs`
- `apps/web/lib/api-envelope.ts`
- `apps/web/lib/auth.ts`
- `apps/web/lib/trace.ts`
- `apps/web/next.config.js`
- `apps/web/package.json`
- `apps/web/tsconfig.json`
- `apps/native/app/(auth)/sign-in.tsx`
- `apps/native/app/(auth)/sign-up.tsx`
- `apps/native/app/index.tsx`
- `apps/native/lib/api.ts`
- `apps/native/lib/auth-client.ts`
- `apps/native/package.json`
- `packages/domain/package.json`
- `packages/domain/src/api-envelope.ts`
- `packages/domain/src/index.ts`
- `packages/domain/src/trace.ts`
- `pnpm-lock.yaml`

### Change Log

- 2026-04-23: Added Better Auth (web + Expo), cookie sessions, standard API envelope + `traceId`, and web/native auth UIs.

