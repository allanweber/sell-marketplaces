---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/research/technical-marketplace-integrations-nl-br-research-2026-04-22-174138.md
  - _bmad-output/planning-artifacts/research/market-sell-items-crosslisting-research-2026-04-22.md
---

# sell-items - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for sell-items, decomposing the requirements from the PRD, UX Design, Architecture, and supporting research into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can create an account and sign in/out.
FR2: Users can manage their profile basics (name, locale, defaults).
FR3: Users can view and manage connected marketplace accounts (“channels”).
FR4: Users can disconnect a marketplace account.
FR5: Users can initiate an account deletion (“delete all”) request.

FR6: Users can browse available marketplaces for their country pack.
FR7: Users can see whether a marketplace is Connected or Assisted and what actions are supported for each.
FR8: System can enforce capability-based behavior (only offer actions supported by that channel).
FR9: Users can complete an authorization/connection flow for Connected marketplaces (where supported).
FR10: Users can set the external listing URL for Assisted postings as part of “confirm posted,” enabling the item’s Assisted channel row to enter Confirmed state.

FR11: Users can create a canonical item listing with core fields (title, description, price, category, condition).
FR12: Users can add/remove/reorder item photos.
FR13: Users can edit any canonical item and save changes.
FR14: Users can duplicate an item to speed up similar listings.
FR15: Users can archive/unarchive items.
FR16: Users can set selling logistics per item (pickup/shipping flags, location/area).
FR17: Users can track each item’s lifecycle state (draft/ready/active/pending/sold).

FR18: Users can create and edit drafts without immediate publishing.
FR19: System can represent per-item sync/publish states clearly (e.g., needs action, queued, succeeded, failed).
FR20: Users can resume an interrupted listing flow without losing entered content.

FR21: Users can select one or more marketplaces to publish an item to.
FR22: System can validate an item against selected marketplace requirements and surface what’s missing.
FR23: Users can publish to Connected marketplaces and receive a clear success/failure result per channel.
FR24: Users can initiate an Assisted posting flow that provides a “listing package” (copy + photos) and deep links to complete posting.
FR25: System can store and show external listing identifiers/links per marketplace for an item.
FR26: Users can re-try a failed publish attempt where safe.
FR27: System can maintain an audit trail of publish attempts per item/channel (for user-visible troubleshooting).

FR28: System can flag an item as “risky category” based on rules and require an optional review step before publishing to selected channels.
FR29: Users can request a human-in-the-loop review for a flagged item and see the review status (pending/approved/rejected) with required changes.
FR30: Admin/Reviewer can review a flagged item and approve/reject it with a reason and required changes.

FR31: Users can view a unified inventory list of all items.
FR32: Users can view per-item, per-marketplace “channel rows” showing status and external links.
FR33: Users can filter/sort inventory by state (draft/active/sold), marketplace, and action-needed.
FR34: Users can see a clear “next action” per channel (e.g., finish Assisted posting, reconnect, retry).

FR35: Users can view conversations for Connected marketplaces inside the product.
FR36: Users can open a conversation thread and view message history available to the product.
FR37: Users can send replies for Connected marketplaces from within the product.
FR38: System can show delivery state for outbound messages (sent/failed/action needed).
FR39: Users can deep-link out to the marketplace conversation for Assisted (or unsupported) inbox channels.
FR40: Users can use reply templates/snippets when responding to buyers.

FR41: Users can mark an item as sold (or pending) in the product.
FR42: System can generate a per-marketplace close-out checklist for an item when it becomes pending/sold.
FR43: Users can execute close-out actions per marketplace (automated where Connected supports it; guided where Assisted).
FR44: System can warn users if some channels are still active when an item is marked sold.

FR45: Users can receive notifications for key events (publish result, new message on Connected channels, assisted “finish posting” reminders).
FR46: Users can manage notification preferences (at minimum: on/off per type).

FR47: Users can view an in-product troubleshooting panel for failures (publish, sync, messaging).
FR48: System can present human-readable error reasons and next steps (fix field, reconnect, retry, link out).
FR49: Users can view or copy a trace/reference ID for a failed operation.
FR50: Users can export a support bundle (diagnostics) for escalation.

FR51: Admin/Ops can view connector health and error rates by marketplace.
FR52: Admin/Ops can view backlog/lag indicators for background processing and message sync.
FR53: Admin/Ops can inspect an individual failure/audit record for debugging (normalized error + reference).
FR54: Admin/Ops can degrade/disable a connector (e.g., switch to Assisted mode) to protect user trust.

FR55: The app uses bottom-tab navigation for primary sections: Inventory (home), Inbox, New Item, and Settings/Ops.
FR56: Inventory supports an optional “cockpit KPI” header (e.g., posted channels, needs action) that can be tapped to apply quick filters.

### NonFunctional Requirements

NFR1: Inventory list loads in ≤ 2s (P95) for a typical user dataset.
NFR2: Open item detail completes in ≤ 2s (P95).
NFR3: Save draft/edit acknowledges in ≤ 1s (P95) (actual background sync may continue).
NFR4: Photo handling provides responsive feedback (upload/processing state visible) and does not block core navigation.
NFR5: Inbox conversation list loads in ≤ 3s (P95) and thread open in ≤ 2s (P95) when data is available locally/from sync.
NFR6: Publish action returns an immediate “queued/processing” confirmation in ≤ 2s (P95), with eventual per-channel outcome state.

NFR7: The system provides at-least-once execution semantics for background jobs with safe retries (no silent drops).
NFR8: Publish attempts are idempotent such that retries do not create duplicate external listings when avoidable.
NFR9: The system surfaces clear, durable states for publish/sync (queued/succeeded/failed/action needed) that survive app restarts.
NFR10: Connected-channel message sync exposes last synced timestamp and supports safe manual refresh.
NFR11: The system preserves drafts and prevents data loss on app crash, network loss, or resume.

NFR12: All sensitive data is encrypted in transit (TLS) and at rest.
NFR13: Marketplace credentials/tokens are stored securely with least privilege and are never exposed as long-lived secrets to clients.
NFR14: The product implements data minimization for messaging (store only what is required for functionality and policy posture).
NFR15: Users can trigger account deletion (“delete all”) with completion within a defined operational window (e.g., ≤ 30 days) and clear confirmation.
NFR16: Access to user data follows least privilege; admin access is gated and audited.
NFR17: Security-relevant events (auth changes, token failures, publish failures with diagnostics access) are logged with correlation/trace IDs.

NFR18: The web app meets WCAG 2.1 AA for core flows (create/edit item, inventory, inbox, troubleshooting).
NFR19: Critical flows are usable with keyboard navigation on web and with screen readers (labels, focus order, error messaging).

NFR20: External marketplace integrations must handle rate limits and transient failures using bounded retries and respect provider retry guidance.
NFR21: The system provides an audit trail for publish/sync operations sufficient for self-serve troubleshooting and rare human intervention.
NFR22: The operator can degrade/disable a connector safely without breaking the core “inventory cockpit” experience.
NFR23: Monitoring exists for connector error rates, queue backlog, token refresh failures, and message sync lag, with alert thresholds configurable.

NFR24: The UI uses a calm-neutral foundation with a trust-forward blue primary; semantic status colors are used sparingly and meaning is never encoded by color alone (icon + text required).
NFR25: The system presents publish outcomes as durable, user-legible states per channel row, and provides a single best “next action” CTA wherever an action is required.

### Additional Requirements

- Use a monorepo starter aligned to Turborepo + Next.js + Expo RN Web; architecture proposes `npx create-turbo@latest -e with-react-native-web`.
- Architecture boundary rule: all marketplace I/O must run in async worker jobs (not on HTTP request path); worker-only connector execution.
- Backend data layer: PostgreSQL + Drizzle ORM + drizzle-kit migrations.
- Job processing: BullMQ with Redis backing; standardized queue/job naming and payload conventions.
- Shared domain types + Zod schemas must live in `packages/domain` (single source of truth).
- Standard API response envelope for all endpoints: `{ data, traceId }` and `{ error, traceId }`.
- Trace ID propagation is mandatory across API → jobs → audit rows → UX troubleshooting; surface trace IDs to users.
- Error normalization: map connector/provider errors to consistent internal error codes (e.g., validation missing field, auth expired, rate limited, provider down).
- Offline-first: mobile drafts stored locally (Expo SQLite) and photo queue (Expo FileSystem); web drafts via IndexedDB (Dexie) when implemented.
- Object storage for photos: Cloudflare R2.
- Auth: Better Auth with cookie-based sessions; Expo integration via Better Auth Expo plugin; clients set Cookie header explicitly for mobile.
- Hosting/deploy target: Hetzner VPS using Dokploy; deploy separate services for web and worker.
- Observability baseline: Sentry acceptable (or Sentry-protocol compatible alternatives like GlitchTip/Bugsink).
- GDPR baseline: “delete all” hard delete workflow + token revocation where possible; data minimization (esp. messaging metadata posture) and address encryption controls.
- Country-pack approach: NL MVP pack includes Marktplaats (Connected) + Facebook Marketplace (Assisted); expansion packs later (e.g., BR).
- Connector feasibility constraints (research):
  - Facebook Marketplace posting is generally partner-restricted; plan Assisted-first posting unless partner access is obtained.
  - Marktplaats API exists but access may be commercially gated; keep degrade-to-Assisted capability and connector kill-switch.
- Integration resilience (research/architecture):
  - Implement exponential backoff + jitter for retries; respect provider retry guidance; do not retry permanent failures.
  - Enforce per-marketplace concurrency and rate-limit budgets in worker.
  - Implement idempotency keys / dedupe to prevent duplicate external listings on retries.
- Optional (later) policy-safe fallback: browser extension (Manifest V3) to assist form-fill for Assisted posting; keep permissions minimal.

### UX Design Requirements

UX-DR1: Implement a cross-platform design token system (colors, semantic status colors, typography scale, spacing 8pt, radius, elevation) shared across mobile (Paper theme) and web theme layer.
UX-DR2: Implement a calm-neutral UI foundation with trust-forward blue primary; ensure status meaning is conveyed by icon + text (not color alone).
UX-DR3: Implement bottom-tab navigation surfaces: Inventory (home), Inbox, New Item, Settings/Ops; keep “return to cockpit” navigation consistent.
UX-DR4: Implement photos-first item creation flow: photo capture/selection first, then minimal required fields with smart defaults.
UX-DR5: Implement “save-first + auto-publish” behavior: saving an item creates a durable draft and auto-starts background publishing for selected channels.
UX-DR6: Implement durable status language everywhere (Inventory, Item detail, Troubleshooting, Inbox): Publishing / Posted / Action needed / Failed / Not started / Confirmed.
UX-DR7: Implement a reusable `CockpitKpiCard` at top of Inventory showing “posted channels” and “needs action” with tap-to-filter behavior; include loading/empty/error states.
UX-DR8: Implement a reusable `ItemCockpitCard` pattern for inventory rows: thumbnail, title, price, logistics, overall status, single “next action,” and per-marketplace channel rows/chips.
UX-DR9: Implement `ChannelStatusChip` (icon + text) for each marketplace row showing Connected vs Assisted and current state; provide compact (list) and full (detail) variants.
UX-DR10: Implement a `NextActionBanner` that always surfaces one best next action CTA per item/channel (e.g., finish assisted posting, retry, reconnect, fix missing field).
UX-DR11: Implement Assisted posting as first-class with an `AssistedChecklistCard` for Facebook:
  - listing package access (copy + photos)
  - deep link out to Facebook posting flow
  - resumable checklist state
  - require “paste listing URL” to mark Assisted channel as Confirmed
  - validation for URL format and clear error messaging
UX-DR12: Implement `TroubleshootingPanel` for publish/sync/inbox failures:
  - human-readable error + recommended fix
  - retry/reconnect actions where safe
  - always show/copy `traceId`
UX-DR13: Implement inbox UX patterned after messaging apps:
  - conversation list → thread view → reply composer
  - show last synced indicator and outbound delivery states (sending/sent/failed)
  - show item/channel context header in thread
UX-DR14: Implement Assisted inbox behavior as capability-honest link-out (no in-app reply UI when unsupported) while preserving item context.
UX-DR15: Implement close-out UX: mark pending/sold, generate per-marketplace close-out checklist, and warn if channels still active when item is sold.
UX-DR16: Implement consistent form patterns: inline validation, “Fix now” deep-links to the exact field/step, progressive disclosure for advanced fields.
UX-DR17: Implement high-signal notifications only: publish outcomes, new Connected message, assisted “finish posting” reminders; provide user controls.
UX-DR18: Implement responsive layout strategy for web:
  - mobile-first single-pane
  - tablet touch-first
  - desktop two-pane (inventory list left, detail/inbox right) at ≥1024px with persistent selection state
UX-DR19: Implement accessibility baseline (WCAG 2.1 AA for web):
  - keyboard navigation for core flows
  - screen reader labels for all inputs/icon buttons
  - focus management for dialogs/sheets
  - touch targets ≥ 44×44px (and equivalent pointer targets on web)
UX-DR20: Implement empty/loading/error states:
  - guided empty Inventory “first win” prompt
  - meaningful publishing states (avoid spinners without state language)
  - calm recovery messaging

### FR Coverage Map

FR1: Epic 1 - Account access
FR2: Epic 1 - Profile basics/defaults
FR3: Epic 1 - Manage connected channels
FR4: Epic 1 - Disconnect channel
FR5: Epic 1 - Delete all request
FR6: Epic 1 - Browse country-pack marketplaces
FR7: Epic 1 - See Connected vs Assisted capabilities
FR8: Epic 1 - Enforce capability-based behavior
FR9: Epic 1 - Connected authorization flow
FR10: Epic 3 - Assisted external listing URL confirm

FR11: Epic 2 - Create canonical item (core fields)
FR12: Epic 2 - Manage photos
FR13: Epic 2 - Edit/save item
FR14: Epic 2 - Duplicate item
FR15: Epic 2 - Archive/unarchive item
FR16: Epic 2 - Selling logistics (pickup/shipping/location)
FR17: Epic 2 - Item lifecycle state tracking
FR18: Epic 2 - Draft creation/editing
FR19: Epic 3 - Durable sync/publish state representation
FR20: Epic 2 - Resume interrupted listing flow

FR21: Epic 3 - Select marketplaces to publish
FR22: Epic 3 - Validate against marketplace requirements
FR23: Epic 3 - Publish to Connected marketplaces
FR24: Epic 3 - Assisted posting flow (listing package + deep links)
FR25: Epic 3 - Store/show external IDs/links
FR26: Epic 3 - Retry failed publish safely
FR27: Epic 3 - Publish attempt audit trail (user-visible troubleshooting)

FR28: Epic 7 - Risky category flagging
FR29: Epic 7 - Request human review + status
FR30: Epic 7 - Reviewer approve/reject with reasons

FR31: Epic 4 - Unified inventory list
FR32: Epic 4 - Per-item channel rows with status/links
FR33: Epic 4 - Inventory filter/sort
FR34: Epic 4 - Per-channel next action

FR35: Epic 5 - Connected inbox conversation list
FR36: Epic 5 - Thread view
FR37: Epic 5 - Send replies (Connected)
FR38: Epic 5 - Delivery state for outbound messages
FR39: Epic 5 - Assisted/unsupported conversation deep link out
FR40: Epic 5 - Reply templates/snippets

FR41: Epic 6 - Mark pending/sold
FR42: Epic 6 - Close-out checklist per marketplace
FR43: Epic 6 - Execute close-out actions (automated/guided)
FR44: Epic 6 - Warn if channels still active on sold

FR45: Epic 8 - Notifications for key events
FR46: Epic 8 - Notification preferences

FR47: Epic 7 - Troubleshooting panel
FR48: Epic 7 - Human-readable errors + next steps
FR49: Epic 7 - Trace/reference ID in UX
FR50: Epic 7 - Export support bundle

FR51: Epic 8 - Ops: connector health/error rates
FR52: Epic 8 - Ops: backlog/lag indicators
FR53: Epic 8 - Ops: inspect failure/audit record
FR54: Epic 8 - Ops: degrade/disable connector

FR55: Epic 1 - Bottom tab navigation (app shell)
FR56: Epic 4 - Inventory KPI header with quick filters

## Epic List

### Epic 1: Get started (Account + Settings + Channels)
Users can sign up/in, set basics, see available marketplaces for their country pack, connect/disconnect channels, and request “delete all”.
**FRs covered:** FR1–FR9, FR55  
**Dependencies (informational):** None (foundation)

### Epic 2: Create & manage a canonical item (photos-first drafts)
Users can create/edit/duplicate/archive items with photos + core fields, plus draft/resume behaviors (offline-first aligned).
**FRs covered:** FR11–FR20  
**Dependencies (informational):** Epic 1 (auth/session)

### Epic 3: Publish everywhere (Connected + Assisted, reliable outcomes)
Users can select channels, validate requirements, publish via Connected (async) and Assisted (listing package + deep link + URL confirm), with retries and audit trail.
**FRs covered:** FR21–FR27 (and includes FR10 for Assisted confirm)
**Dependencies (informational):** Epic 1 (auth + channels), Epic 2 (canonical item)

### Epic 4: Inventory cockpit (see everything + next actions)
Users get the cockpit home: unified inventory, per-marketplace channel rows, filter/sort, and a clear next action per channel.
**FRs covered:** FR31–FR34, FR56
**Dependencies (informational):** Epic 2 (items), Epic 3 (channel status model)

### Epic 5: Inbox cockpit (Connected reply, Assisted link-out)
Users can triage conversations, open threads, reply for Connected channels with delivery state, use templates/snippets, and link out for Assisted.
**FRs covered:** FR35–FR40
**Dependencies (informational):** Epic 1 (auth), Epic 3 (connected channel integration + worker sync)

### Epic 6: Close-out the sale (pending/sold + per-channel checklist)
Users can mark pending/sold, follow a per-marketplace close-out checklist, and avoid double-selling with “still active” warnings.
**FRs covered:** FR41–FR44
**Dependencies (informational):** Epic 2 (items), Epic 3 (channel rows + listing identifiers/links)

### Epic 7: Trust, safety & exceptional flows (review + troubleshooting)
Users can resolve problems in-app (troubleshooting panel, trace IDs, support bundle), and handle risky-category review workflow when applicable.
**FRs covered:** FR28–FR30, FR47–FR50
**Dependencies (informational):** Cross-cutting (applies to Epics 1–6)

### Epic 8: Operability & notifications (stay informed; keep it running)
Users can manage notification preferences and receive key alerts; operator can monitor connector health/backlogs and degrade/disable connectors.
**FRs covered:** FR45–FR46, FR51–FR54
**Dependencies (informational):** Epic 3 (worker jobs + outcomes), Epic 5 (message events)

## Epic 1: Get started (Account + Settings + Channels)

Users can sign up/in, set basics, see available marketplaces for their country pack, connect/disconnect channels, and request “delete all”.

### Story 1.1: [Enabling] Set up initial project from the starter template

As a developer,
I want to initialize the monorepo from the selected starter template,
So that we have a working baseline for web, mobile, and shared packages.

**Acceptance Criteria:**

**Given** the architecture specifies `npx create-turbo@latest -e with-react-native-web`
**When** the project is initialized
**Then** the repo contains working `apps/web` and `apps/native` projects (and workspace tooling)
**And** the default dev commands run successfully for web and native

**Given** a developer follows the README/setup steps
**When** they install dependencies and run the dev servers
**Then** the app starts without errors using the documented steps

### Story 1.2: Sign up & sign in with email/password (web + mobile)

As a seller,
I want to create an account and sign in with email/password,
So that I can access my inventory and connected channels across devices.

**Acceptance Criteria:**

**Parity rule:** Implement **web + mobile** in this same story (shared API contract; platform UIs may ship sequentially but both must be completed before story is “Done”).

**Persistence rule:** This story is not “Done” until auth is **durable** (Postgres-backed) and the DB baseline exists.

**Given** the architecture specifies PostgreSQL + Drizzle + drizzle-kit with schema centralized in `packages/db`  
**When** this story is completed  
**Then** the repo includes a Drizzle schema baseline (tables) and drizzle-kit migration setup under `packages/db`  
**And** initial migrations exist and can be applied in development consistently

**Given** I am not signed in
**When** I sign up with email/password
**Then** my account is created and I am signed in successfully on that device
**And** I can sign out and sign back in with the same credentials

**Given** I enter invalid credentials
**When** I attempt to sign in
**Then** I see a clear, user-safe error message (no sensitive detail leakage)
**And** the server returns a standard error envelope that includes a `traceId`

#### Story 1.2.1: Transactional email sender (Resend) for auth OTP messages

As a developer,
I want a server-side email sender using Resend,
So that the system can send OTPs and other auth-related emails reliably.

**Acceptance Criteria:**

**Given** Resend is the selected email provider
**When** the email sender is configured
**Then** the system can send transactional emails via Resend using:
- `RESEND_API_KEY`
- `RESEND_FROM="sellitems@allanweber.dev"`

**Given** an email is sent
**When** an operator checks the Resend dashboard
**Then** they can view the sent email details and delivery events/logs for troubleshooting

**Given** email sending is triggered from auth flows
**When** an OTP email is sent
**Then** the implementation does not block the request path by awaiting email sending (avoid timing attacks)

#### Story 1.2.2: Email activation with OTP (Better Auth Email OTP) (web + mobile)

As a seller,
I want to verify my email address using an OTP code,
So that my account is activated and protected against email typos and abuse.

**Acceptance Criteria:**

**Parity rule:** Implement **web + mobile** in this same story (shared API contract; platform UIs may ship sequentially but both must be completed before story is “Done”).

**Given** I sign up with email/password
**When** my account is created
**Then** the system sends an email OTP verification code to my email
**And** the email is sent via Resend from `sellitems@allanweber.dev`

**Given** my email is not verified
**When** I attempt to sign in
**Then** I am blocked from completing sign-in until verification is complete
**And** I see a clear, user-safe message explaining that verification is required (no sensitive detail leakage)

**Given** I received an OTP code
**When** I submit the OTP code
**Then** my email is marked verified (`emailVerified=true`)
**And** I can successfully sign in afterwards

**Given** I did not receive the code or it expired
**When** I request a new OTP
**Then** a new OTP is sent (rate-limited)
**And** the UI explains the wait/limit calmly
**And** the response includes a `traceId` using the standard envelope

#### Story 1.2.3: Forgot password + reset password using email OTP (Resend) (web + mobile)

As a seller,
I want to reset my password using an OTP code sent to my email,
So that I can regain access without support.

**Acceptance Criteria:**

**Parity rule:** Implement **web + mobile** in this same story (shared API contract; platform UIs may ship sequentially but both must be completed before story is “Done”).

**Given** I forgot my password
**When** I request a password reset with my email
**Then** the system sends a password reset OTP to that email (if it exists)
**And** the response is user-safe and does not reveal whether the email is registered (anti-enumeration)

**Given** I received the reset OTP
**When** I submit the OTP and a new password
**Then** my password is reset successfully
**And** I can sign in with the new password

**Given** I submit an invalid or expired OTP
**When** I attempt to reset my password
**Then** I see a clear, user-safe error message
**And** the server returns a standard error envelope that includes a `traceId`

### Story 1.3: Social login (post-MVP candidate)

As a seller,
I want to sign up/sign in with Google, Facebook, or Instagram,
So that I can get started faster without creating a password.

**Acceptance Criteria:**

**MVP scope note:** This story is **post-MVP by default**. If pulled into MVP, reduce to **one provider** and document the rationale.

**Given** I am not signed in
**When** I choose Google, Facebook, or Instagram login and complete the provider flow
**Then** I am signed in and returned to the app
**And** my account links to that provider identity

**Given** I previously signed up via email/password
**When** I complete a social login flow using the same email (where provider supplies it)
**Then** the product does not accidentally create a duplicate account
**And** I receive a clear outcome (account linked or a safe prompt to resolve)

**Given** the provider flow fails or is cancelled
**When** I return to the app
**Then** I can retry or choose a different sign-in method
**And** failures return a standard error envelope that includes a `traceId`

### Story 1.4: Design system foundation (tokens + theming) (web + mobile)

As a seller,
I want the app to feel consistent, calm, and trustworthy across web and mobile,
So that every screen looks and behaves like the same product.

**Acceptance Criteria:**

**Parity rule:** Implement **web + mobile** in this same story (shared tokens; platform-specific wiring is allowed but both must be completed before story is “Done”).

**Given** the UX design requirements specify a cross-platform token system (colors, semantic status colors, typography scale, spacing 8pt, radius, elevation)  
**When** the design system foundation is implemented  
**Then** shared tokens exist as a single source of truth and cover at minimum:
- base neutrals + surfaces
- trust-forward blue primary
- semantic/status colors (success/warn/error/info)
- typography scale (sizes/weights)
- spacing scale (8pt increments)
- radius and elevation/shadow tokens

**Given** the app uses semantic/status colors  
**When** status is conveyed in UI  
**Then** meaning is **never encoded by color alone** (icon + text required wherever status is shown)

**Given** the web app is running  
**When** a screen renders using the design system  
**Then** the theme consumes the shared tokens (e.g., via CSS variables and/or a theme provider) and core surfaces/typography match the token values

**Given** the native app is running  
**When** a screen renders using the design system  
**Then** the theme consumes the shared tokens (e.g., via a theme object mapped into the RN UI layer) and core surfaces/typography match the token values

### Story 1.5: UI primitives built on tokens (web + mobile)

As a developer,
I want a small set of reusable UI primitives built on the tokens,
So that feature screens don’t invent one-off styles and the UI stays consistent.

**Acceptance Criteria:**

**Parity rule:** Implement **web + mobile** in this same story (shared API/design intent; platform implementations may differ).

**Given** the design system tokens exist  
**When** UI primitives are implemented  
**Then** the project provides at minimum:
- `Button` (variants: primary/secondary/ghost; disabled + loading states)
- `Text` (typography variants)
- `TextField`/`Input` (label, helper, error states)
- `Card`/`Surface`
- `Chip`/`Badge`
- `Icon` wrapper (size + color semantics)
- `Spinner`/`Progress`
- `Alert`/`InlineError`
- `Divider`
- `ListRow` (tap/press states)

**Given** a primitive is focused/hovered/pressed/disabled/loading  
**When** it renders  
**Then** its interaction states are clearly defined and consistent across web and mobile

**Given** a form field has a validation error  
**When** the error is displayed  
**Then** the pattern is consistent (message placement, semantics/ARIA on web, accessible labels on mobile) and uses tokenized spacing/typography

### Story 1.6: Navigation + layout conventions wired (tabs baseline + responsive web layout scaffold)

As a seller,
I want navigation and layout to feel predictable across platforms,
So that I can move around quickly without re-learning each screen.

**Acceptance Criteria:**

**Parity rule:** Implement **web + mobile** in this same story (navigation style conventions + shared layout rules).

**Given** I am signed in  
**When** I use the bottom-tab navigation  
**Then** active/inactive states, spacing, icon sizing, and touch targets are consistent with the design tokens  
**And** touch targets meet the 44×44px minimum (or equivalent on web)

**Given** I use the web app on different screen widths  
**When** the viewport changes  
**Then** the responsive layout rules are implemented as a scaffold:
- mobile-first single-pane
- tablet touch-first
- desktop ≥1024px prepares for two-pane layouts with persistent selection state (where applicable)

### Story 1.7: Apply design system to existing auth + settings surfaces (adoption sweep) (web + mobile)

As a seller,
I want the sign-in and early settings screens to feel polished and consistent,
So that I trust the product from the first interaction.

**Acceptance Criteria:**

**Parity rule:** Implement **web + mobile** in this same story.

**Given** the sign-in and sign-up screens exist  
**When** this story is completed  
**Then** those screens use the design tokens and primitives (spacing, typography, buttons, inputs, error states) with no ad-hoc styling

**Given** the Settings/Profile (or early settings shell) exists  
**When** this story is completed  
**Then** it uses the design tokens and primitives consistently

**Given** an auth error occurs (invalid credentials, unverified email, etc.)  
**When** the UI displays the error  
**Then** the message is calm and user-safe, follows the standardized error pattern, and is accessible (focus/announcement on web; readable labels on mobile)

### Story 1.8: Profile basics & defaults (locale + listing defaults)

As a seller,
I want to set my basic profile and defaults,
So that creating listings is faster and consistent.

**Acceptance Criteria:**

**Parity rule:** Implement **web + mobile** in this same story (shared API contract; platform UIs may ship sequentially but both must be completed before story is “Done”).

**Given** I am signed in
**When** I view Settings/Profile
**Then** I can view and update profile basics (name, locale) and default listing preferences

**Given** I update my defaults
**When** I save changes
**Then** changes persist and are reflected in future item creation flows
**And** the save response includes a `traceId`

### Story 1.9: Marketplace directory for my country pack (capability-honest)

As a seller,
I want to see the marketplaces available in my country pack and what they support,
So that I can understand what actions are possible (Connected vs Assisted).

**Acceptance Criteria:**

**Given** I am signed in
**When** I open the Marketplaces/Channels screen
**Then** I see the list of marketplaces for my country pack
**And** each marketplace clearly indicates whether it is Connected or Assisted
**And** each marketplace shows the supported capabilities (e.g., publish, status, inbox/reply, close-out) without ambiguity

**Given** a connector is degraded/disabled by ops
**When** I view that marketplace in the directory
**Then** I see its current operational status and the resulting capability limitations

### Story 1.10: Connect and disconnect marketplace accounts (Connected channels)

As a seller,
I want to connect and disconnect marketplace accounts,
So that I can publish and manage my listings where Connected is supported.

**Acceptance Criteria:**

**Given** a marketplace supports Connected auth
**When** I start the connect flow and complete authorization
**Then** the marketplace account is connected to my user
**And** the UI reflects connected status

**Given** my connected marketplace token expires or becomes invalid
**When** the product detects this
**Then** I see a clear reconnect action
**And** no Connected-only actions are shown as available until reconnected

**Given** I disconnect a marketplace account
**When** I confirm disconnect
**Then** the account is disconnected and tokens are revoked/invalidated where possible
**And** the UI removes Connected-only actions for that marketplace

### Story 1.11: App shell navigation (Inventory, Inbox, New Item, Settings/Ops)

As a seller,
I want consistent primary navigation,
So that I can quickly move between the cockpit, inbox, item creation, and settings.

**Acceptance Criteria:**

**Given** I am signed in
**When** I use the primary navigation
**Then** I can reach Inventory (home), Inbox, New Item, and Settings/Ops
**And** the current section is clearly indicated

### Story 1.12: “Delete all” account deletion request (GDPR-aligned)

As a seller,
I want to request deletion of my account and all my data,
So that I can exercise my right to be forgotten.

**Acceptance Criteria:**

**Given** I am signed in
**When** I request “delete all” and confirm
**Then** the system initiates an account deletion workflow
**And** I receive a clear confirmation that includes what will be deleted and an expected completion window

**Given** I request “delete all”
**When** the workflow executes
**Then** user-owned data is hard-deleted (items, photos metadata, addresses) per defined policy
**And** marketplace tokens are revoked where possible
**And** operational logs/metrics retain only minimized/redacted data per retention policy

## Epic 2: Create & manage a canonical item (photos-first drafts)

Users can create/edit/duplicate/archive items with photos + core fields, plus draft/resume behaviors (offline-first aligned).

### Story 2.1: Start a new item with photos-first creation

As a seller,
I want to start a new item by taking or selecting photos first,
So that creating a listing feels fast and matches my real workflow.

**Acceptance Criteria:**

**Given** I am signed in
**When** I start a new item and add at least one photo
**Then** a durable draft item is created
**And** I can proceed to add title/price/description and other details later

**Given** I lose connectivity mid-creation
**When** I continue editing the draft
**Then** my changes are saved locally and not lost
**And** the UI clearly indicates the item is a draft and sync/publish is not yet completed

### Story 2.2: Edit core item fields (title, description, price, category, condition)

As a seller,
I want to edit the core fields of an item draft,
So that I can prepare a complete listing for publishing.

**Acceptance Criteria:**

**Given** I have an item draft
**When** I edit title, description, price, category, and condition and save
**Then** the draft persists and reopens with the same values across app restarts
**And** server persistence (when online) returns a response including a `traceId`

**Given** I enter invalid field values (e.g., missing required title or invalid price format)
**When** I attempt to save
**Then** I see inline validation with a clear explanation of what to fix

### Story 2.3: Manage item photos (add/remove/reorder)

As a seller,
I want to add, remove, and reorder photos on my item,
So that my listing looks good across marketplaces.

**Acceptance Criteria:**

**Given** I am editing an item
**When** I add photos, remove photos, or reorder photos
**Then** the item’s photos update correctly and persist
**And** the primary photo used for previews is the first photo in the order

**Given** photos are still uploading/syncing
**When** I navigate away and come back
**Then** I can see clear per-photo progress/state (queued/uploading/failed)
**And** I can retry failed uploads without losing the draft

### Story 2.4: Selling logistics (pickup/shipping + location/area)

As a seller,
I want to set pickup/shipping options and my location/area for an item,
So that buyers get accurate logistics and I stay safe.

**Acceptance Criteria:**

**Given** I am editing an item
**When** I set pickup/shipping flags and location/area and save
**Then** those values persist on the item and can be edited later

**Given** I have not provided an exact address
**When** I set location
**Then** the product supports an “approx area” default (without requiring exact address)

### Story 2.5: Duplicate an item to speed up similar listings

As a seller,
I want to duplicate an existing item,
So that I can list similar items faster without re-entering everything.

**Acceptance Criteria:**

**Given** I have an existing item
**When** I choose “Duplicate”
**Then** a new draft item is created with copied fields and photos references as appropriate
**And** the duplicated item can be edited independently without changing the original

### Story 2.6: Archive and unarchive items

As a seller,
I want to archive items I’m no longer working on and restore them later,
So that my inventory stays organized.

**Acceptance Criteria:**

**Given** I have an item
**When** I archive it
**Then** it is removed from the default active inventory view
**And** it remains accessible from an archived view

**Given** an item is archived
**When** I unarchive it
**Then** it returns to the active inventory view

### Story 2.7: Item lifecycle state tracking (draft/ready/active/pending/sold)

As a seller,
I want the product to track an item’s lifecycle state,
So that I can understand where it is in my selling process.

**Acceptance Criteria:**

**Given** I create a new item
**When** it is first saved
**Then** it is in a Draft state

**Given** I later publish and/or mark the item pending/sold
**When** those actions occur
**Then** the item state transitions are reflected consistently in the UI
**And** state changes persist across sessions

### Story 2.8: Resume an interrupted listing flow

As a seller,
I want to resume an interrupted listing flow,
So that I never lose progress if I stop mid-way.

**Acceptance Criteria:**

**Given** I was creating/editing an item and I leave the app or close the browser
**When** I return later
**Then** I can resume from my last saved state without data loss

**Given** there are unsynced changes due to connectivity loss
**When** connectivity returns
**Then** the product syncs changes to the server safely
**And** the UI updates to reflect synced state without confusing the user

## Epic 3: Publish everywhere (Connected + Assisted, reliable outcomes)

Users can select channels, validate requirements, publish via Connected (async) and Assisted (listing package + deep link + URL confirm), with retries and audit trail.

### Story 3.1: Choose marketplaces per item with capability-honest defaults

As a seller,
I want to choose which marketplaces to publish my item to (defaulting to my country-pack),
So that I can maximize reach while staying in control.

**Acceptance Criteria:**

**Given** I am editing an item
**When** I open marketplace selection for the item
**Then** I see marketplaces for my country pack selected by default (with easy opt-out)
**And** each marketplace indicates Connected vs Assisted and supported capabilities

**Given** a marketplace is not connected (auth missing/expired)
**When** I view marketplace selection
**Then** the UI clearly indicates that publishing will require connecting or will degrade to Assisted where supported

### Story 3.2: Pre-publish validation per selected marketplace (actionable missing fields)

As a seller,
I want the system to validate my item against the requirements of the marketplaces I selected,
So that I can fix issues before publishing.

**Acceptance Criteria:**

**Given** I selected one or more marketplaces
**When** I attempt to publish
**Then** the system validates the item against each marketplace’s requirements
**And** I see an actionable list of missing/invalid fields per marketplace with “Fix now” deep-links

**Given** validation fails for one marketplace but not others
**When** I publish
**Then** marketplaces that pass validation may proceed to publish
**And** failing marketplaces go to an “Action needed” state with clear next steps

### Story 3.3: Enqueue publishing and show durable per-channel outcomes (async worker)

As a seller,
I want publishing to run in the background with clear outcomes per marketplace,
So that the app stays fast and I always know what happened.

**Acceptance Criteria:**

**Given** my item passes validation for a Connected marketplace
**When** I publish
**Then** the system enqueues a background job (no marketplace I/O on the HTTP request path)
**And** the UI immediately shows a durable “Publishing” state for that marketplace row

**Given** the worker completes the job
**When** I refresh or return later
**Then** the marketplace row resolves to a durable final state (Posted / Action needed / Failed)
**And** the item displays an external listing link/identifier when available

**Given** the publish request is accepted
**When** the API responds
**Then** the response follows the standard envelope and includes a `traceId`

### Story 3.4: Assisted publishing for Facebook Marketplace (listing package + deep links + resumable checklist)

As a seller,
I want an Assisted publishing flow for Facebook Marketplace,
So that I can post policy-safely while still benefiting from “create once” content.

**Acceptance Criteria:**

**Given** Facebook Marketplace is selected for an item
**When** I start Assisted publishing
**Then** I can access a listing package (copy + photos) and a deep link to complete posting in Facebook
**And** the item’s Facebook row shows “Action needed” with a clear “Finish posting” next action until confirmed

**Given** I leave mid-way through Assisted posting
**When** I return later
**Then** I can resume the Assisted checklist and access the same listing package without data loss

### Story 3.5: Confirm Assisted posting by pasting the external listing URL

As a seller,
I want to paste the external listing URL after finishing Assisted posting,
So that the cockpit can honestly track that the item is posted.

**Acceptance Criteria:**

**Given** I completed Assisted posting in Facebook
**When** I paste the external listing URL into the Assisted checklist and confirm
**Then** the system validates and stores the URL
**And** the Facebook channel row transitions to a durable “Confirmed/Posted” state with the link visible

**Given** I paste an invalid URL format
**When** I confirm
**Then** I see a clear validation error and the channel row remains “Action needed”

### Story 3.6: Retry failed publish safely with idempotency and audit trail

As a seller,
I want to retry a failed publish,
So that transient issues don’t block me from listing.

**Acceptance Criteria:**

**Given** a marketplace row is in Failed state due to a transient error (e.g., rate limit/provider down)
**When** I choose Retry
**Then** the system enqueues a new publish attempt
**And** the publish is idempotent (does not create duplicate external listings when avoidable)

**Given** a publish failure is due to a permanent validation issue
**When** I attempt to retry
**Then** the UI directs me to fix the required fields first (Action needed) instead of repeatedly retrying

**Given** a publish attempt occurs
**When** I view troubleshooting details for that attempt
**Then** I can see a trace/reference ID and a human-readable reason with next steps

### Story 3.7: View publish history (audit trail) per item and marketplace

As a seller,
I want to see a publish attempt history for each marketplace on an item,
So that I can understand what happened and self-serve fixes.

**Acceptance Criteria:**

**Given** I open an item’s publish/troubleshooting view
**When** publish attempts exist
**Then** I can see a list of attempts per marketplace with timestamps and normalized outcomes
**And** each attempt shows a trace/reference ID suitable for support escalation

## Epic 4: Inventory cockpit (see everything + next actions)

Users get the cockpit home: unified inventory, per-marketplace channel rows, filter/sort, and a clear next action per channel.

### Story 4.1: Unified inventory list (cockpit home)

As a seller,
I want to see a unified list of all my items,
So that I always know what I’m selling and what needs attention.

**Acceptance Criteria:**

**Given** I am signed in and have items
**When** I open Inventory
**Then** I see a list of items with key summary info (thumbnail, title, price, lifecycle state)
**And** the list loads within performance expectations (P95 targets from NFRs)

**Given** I have no items
**When** I open Inventory
**Then** I see a guided empty state that helps me create my first item

### Story 4.2: Item cockpit card shows per-marketplace channel rows (status + links)

As a seller,
I want each item to show per-marketplace channel rows with status and links,
So that I can see where it’s listed and jump to the external listing when needed.

**Acceptance Criteria:**

**Given** an item has selected marketplaces
**When** I view the item in Inventory
**Then** I can see a row/chip per marketplace with its durable status (Publishing/Posted/Action needed/Failed/Not started/Confirmed)
**And** when an external link exists, I can open it

**Given** a marketplace is Assisted
**When** I view its channel row
**Then** it clearly indicates Assisted and only shows actions that are supported (capability-honest)

### Story 4.3: “Single best next action” per item/channel from the cockpit

As a seller,
I want the cockpit to show me the single best next action for each item,
So that I can progress without hunting through screens.

**Acceptance Criteria:**

**Given** an item has at least one channel in Action needed/Failed
**When** I view the item card
**Then** the UI surfaces one best next action CTA (e.g., Finish Facebook posting, Fix missing field, Retry publish, Reconnect)
**And** tapping it takes me directly to the relevant step/screen

**Given** an item has no actions needed
**When** I view the item card
**Then** no misleading CTA is shown (calm, neutral state)

### Story 4.4: Inventory filtering and sorting (state, marketplace, action-needed)

As a seller,
I want to filter and sort my inventory,
So that I can focus on what needs action and manage sales efficiently.

**Acceptance Criteria:**

**Given** I am viewing Inventory
**When** I apply filters (Action needed, Publishing, Posted, Sold, Marketplace)
**Then** the list updates accordingly and the active filters are visible

**Given** I change sort order (e.g., newest updated, price, status)
**When** I apply the sort
**Then** the list order updates and persists for my session

### Story 4.5: Cockpit KPI header with tap-to-filter quick actions

As a seller,
I want a simple KPI header showing “posted channels” and “needs action,”
So that I can quickly understand progress and jump to the right filter.

**Acceptance Criteria:**

**Given** I have items in different publish states
**When** I view Inventory
**Then** I see a KPI header showing counts for posted channels and needs action
**And** tapping a KPI applies the corresponding filter

**Given** publish states change in the background
**When** I stay on Inventory
**Then** the KPI and item cards update to reflect the new durable states without confusion

## Epic 5: Inbox cockpit (Connected reply, Assisted link-out)

Users can triage conversations, open threads, reply for Connected channels with delivery state, use templates/snippets, and link out for Assisted.

### Story 5.1: Conversation list for Connected marketplaces (unified inbox)

As a seller,
I want a conversation list for my Connected marketplaces,
So that I can quickly see who needs a reply and not miss buyers.

**Acceptance Criteria:**

**Given** I am signed in and have Connected marketplace conversations
**When** I open Inbox
**Then** I see a list of conversations with unread indicators, timestamps, and marketplace identity
**And** I see a “last synced” indicator for the inbox data

**Given** inbox sync is delayed or fails
**When** I open Inbox
**Then** I see the last successful sync time and a safe manual refresh action
**And** any error state is human-readable and includes a `traceId` where applicable

### Story 5.2: Thread view with item/channel context

As a seller,
I want to open a conversation thread with clear item context,
So that I can reply accurately without losing the cockpit context.

**Acceptance Criteria:**

**Given** I select a conversation in the inbox
**When** the thread opens
**Then** I can see the available message history for that channel
**And** I can see item/channel context (item title/photo + marketplace) at the top of the thread

### Story 5.3: Reply to buyers for Connected channels with delivery states

As a seller,
I want to reply from inside sell-items for Connected channels,
So that I can handle buyers without switching apps.

**Acceptance Criteria:**

**Given** I am viewing a Connected thread
**When** I send a reply
**Then** the message is sent via background processing as needed
**And** the UI shows delivery state (Sending/Sent/Failed) clearly

**Given** a message fails to send
**When** I view the failed message
**Then** I can retry if it is safe to retry
**And** I can deep-link out to the marketplace conversation as a fallback

### Story 5.4: Assisted/unsupported inbox behavior is capability-honest link-out

As a seller,
I want Assisted channels to link out for messaging when in-app messaging is not supported,
So that the product remains honest and I can still reach the conversation quickly.

**Acceptance Criteria:**

**Given** a marketplace is Assisted or does not support in-app reply
**When** I attempt to view or reply to that conversation in sell-items
**Then** the product does not show a reply composer it cannot guarantee
**And** it provides a deep link to the marketplace conversation flow

### Story 5.5: Reply templates/snippets for faster buyer communication

As a seller,
I want reply templates/snippets,
So that I can respond faster and more consistently.

**Acceptance Criteria:**

**Given** I am viewing a Connected thread
**When** I open templates/snippets
**Then** I can insert a snippet into the reply composer and edit it before sending

**Given** I am in Settings
**When** I manage snippets
**Then** I can create, edit, and delete snippets

## Epic 6: Close-out the sale (pending/sold + per-channel checklist)

Users can mark pending/sold, follow a per-marketplace close-out checklist, and avoid double-selling with “still active” warnings.

### Story 6.1: Mark item as pending pickup or sold

As a seller,
I want to mark an item as pending pickup or sold,
So that my cockpit reflects reality and I can reduce double-selling risk.

**Acceptance Criteria:**

**Given** I have an active item
**When** I mark it as Pending pickup
**Then** the item’s lifecycle state updates consistently across the app
**And** the UI highlights any channels that still need close-out actions

**Given** I have an item that is sold
**When** I mark it as Sold
**Then** the item’s lifecycle state updates to Sold
**And** I am guided to complete close-out actions per marketplace

### Story 6.2: Generate per-marketplace close-out checklist

As a seller,
I want a close-out checklist per marketplace when I mark an item pending/sold,
So that I know exactly what to do to end listings everywhere.

**Acceptance Criteria:**

**Given** I mark an item as Pending pickup or Sold
**When** I open the close-out view
**Then** I see a checklist of marketplaces with the correct required action per channel (automated for Connected where supported; guided link-out for Assisted)
**And** each checklist step clearly indicates its status (Not started / In progress / Done / Failed)

### Story 6.3: Execute close-out actions for Connected marketplaces (best-effort, async)

As a seller,
I want sell-items to attempt automated close-out on Connected marketplaces,
So that I don’t have to repeat the same “mark sold/end listing” actions manually.

**Acceptance Criteria:**

**Given** an item has a Connected marketplace listing that supports close-out
**When** I run the close-out step
**Then** the system enqueues an async worker job to end/mark sold on that marketplace
**And** the UI shows a durable outcome (Done / Failed / Action needed) for that step

**Given** the marketplace does not support automated close-out or the connector is degraded
**When** I run close-out
**Then** the checklist provides a guided, capability-honest path (e.g., link-out) instead of pretending automation succeeded

### Story 6.4: Guided close-out for Assisted marketplaces (link-out + return-to-cockpit)

As a seller,
I want guided close-out for Assisted marketplaces,
So that I can end my listings even when automation isn’t possible.

**Acceptance Criteria:**

**Given** an item has an Assisted marketplace listing
**When** I select its close-out step
**Then** I get clear instructions and a deep link to complete the action in the marketplace
**And** I can return to sell-items and mark the step as completed (capability-honest confirmation)

### Story 6.5: Warn when channels are still active after marking sold

As a seller,
I want the product to warn me if some channels are still active after I mark an item sold,
So that I avoid accidental double-selling.

**Acceptance Criteria:**

**Given** I mark an item as Sold
**When** one or more marketplaces are still active or unconfirmed
**Then** I see a clear warning and a primary CTA to complete close-out now
**And** the inventory cockpit surfaces the item as needing action until close-out is resolved

## Epic 7: Trust, safety & exceptional flows (review + troubleshooting)

Users can resolve problems in-app (troubleshooting panel, trace IDs, support bundle), and handle risky-category review workflow when applicable.

### Story 7.1: Risky category detection and pre-publish gating (optional review flow)

As a seller,
I want the system to flag risky categories and guide me through any required review steps,
So that I can publish successfully without unexpected rejections.

**Acceptance Criteria:**

**Given** I prepare an item for publishing
**When** the system determines the item is in a risky category
**Then** the UI clearly indicates “Review required” for affected marketplaces (or overall publish)
**And** publishing to those marketplaces is gated until review is completed (when policy/configured rules require it)

**Given** an item is flagged for review
**When** I view the reason
**Then** I see a human-readable explanation and the required changes (if any)

### Story 7.2: Request human-in-the-loop review and track review status

As a seller,
I want to request a review for a flagged item and track its status,
So that I know when I can publish.

**Acceptance Criteria:**

**Given** my item is flagged for review
**When** I submit a review request
**Then** the system records the request and shows status (Pending/Approved/Rejected)
**And** I can continue editing the item while waiting (with clear guidance on what will trigger re-review)

**Given** the review outcome changes
**When** I return to the item
**Then** I see the latest status and any reviewer notes (reason + required changes)

### Story 7.3: Reviewer workflow (approve/reject with reason and required changes)

As an admin/reviewer,
I want to review flagged items and approve or reject them with clear reasons,
So that risky listings are controlled without blocking legitimate sellers.

**Acceptance Criteria:**

**Given** I am an authorized reviewer
**When** I view the review queue
**Then** I can inspect item details needed for review and decide Approved or Rejected
**And** I must provide a reason (and optional required changes) before submitting the decision

**Given** I submit a decision
**When** the seller views the item
**Then** they can see the decision outcome and guidance in a human-readable form

### Story 7.4: Troubleshooting panel for publish/sync/inbox failures (actionable recovery)

As a seller,
I want a troubleshooting panel that explains failures and what to do next,
So that I can fix issues without contacting support.

**Acceptance Criteria:**

**Given** a publish, sync, or messaging failure occurs
**When** I open the troubleshooting panel from the relevant item/channel/inbox screen
**Then** I see a calm, human-readable explanation of what failed
**And** I see the single best next action (Fix field / Reconnect / Retry / Link out)

**Given** the failure has a trace/reference ID
**When** I view troubleshooting details
**Then** I can copy the `traceId` (or reference ID) easily

### Story 7.5: Standardized error envelope and traceId surfaced across user-facing failures

As a seller,
I want errors to be consistently formatted and traceable,
So that support (if needed) can help me quickly and I don’t see confusing raw errors.

**Acceptance Criteria:**

**Given** any API request fails
**When** the client receives an error
**Then** the response uses the standard error envelope and includes a `traceId`
**And** the UI shows a user-safe message (never raw provider errors as the only message)

### Story 7.6: Export a support bundle for escalation

As a seller,
I want to export a support bundle when something is stuck,
So that I can share diagnostics without back-and-forth.

**Acceptance Criteria:**

**Given** I am in a troubleshooting context
**When** I choose “Export support bundle”
**Then** a bundle is generated containing relevant trace IDs and diagnostics (redacted/minimized for privacy)
**And** I can copy/share it via the platform share mechanism (or download on web)

## Epic 8: Operability & notifications (stay informed; keep it running)

Users can manage notification preferences and receive key alerts; operator can monitor connector health/backlogs and degrade/disable connectors.

### Story 8.1: Notification preferences (high-signal only)

As a seller,
I want to control notification preferences,
So that I get important updates without being spammed.

**Acceptance Criteria:**

**Given** I am signed in
**When** I open notification settings
**Then** I can enable/disable notifications by type (at minimum: publish outcomes, new Connected message, assisted “finish posting” reminders)
**And** my preferences persist across sessions and devices

### Story 8.2: Publish outcome notifications

As a seller,
I want to be notified when publishing succeeds or fails,
So that I can take action quickly without constantly checking the app.

**Acceptance Criteria:**

**Given** I publish an item to one or more marketplaces
**When** a marketplace outcome resolves to Posted/Action needed/Failed
**Then** I receive a notification according to my preferences
**And** tapping the notification deep-links me to the relevant item/channel context

### Story 8.3: Connected inbox message notifications

As a seller,
I want notifications for new inbound messages on Connected channels,
So that I don’t miss buyers.

**Acceptance Criteria:**

**Given** I have Connected inbox notifications enabled
**When** a new message is detected/synced
**Then** I receive a notification that indicates the marketplace and item context
**And** tapping the notification opens the relevant conversation thread

### Story 8.4: Assisted “finish posting” reminders

As a seller,
I want a gentle reminder when I started Assisted posting but didn’t confirm it,
So that I complete the listing and the cockpit stays accurate.

**Acceptance Criteria:**

**Given** I started Assisted posting for a marketplace and it remains unconfirmed
**When** the reminder conditions are met (time-based or state-based)
**Then** I receive a reminder notification according to my preferences
**And** tapping the reminder opens the Assisted checklist for that item

### Story 8.5: Ops dashboard for connector health and backlog

As an operator,
I want an ops view that shows connector health, error rates, and backlog/lag,
So that I can keep the system reliable without being on call constantly.

**Acceptance Criteria:**

**Given** I am an authorized operator
**When** I open the ops dashboard
**Then** I can see per-connector health indicators and recent error-rate signals
**And** I can see backlog/lag indicators for background processing and inbox sync

### Story 8.6: Inspect failures and audit records (normalized errors + traceId)

As an operator,
I want to inspect individual failures with normalized errors and trace IDs,
So that I can debug issues quickly and help users self-serve.

**Acceptance Criteria:**

**Given** a publish/sync job fails
**When** I open its details in ops tooling
**Then** I can see a normalized error code, relevant metadata, timestamps, and trace/reference IDs
**And** I can correlate it back to user-facing troubleshooting references

### Story 8.7: Degrade/disable a connector (kill switch) safely

As an operator,
I want to degrade/disable a connector safely,
So that I can protect user trust when a marketplace integration is unreliable or policy-constrained.

**Acceptance Criteria:**

**Given** a connector is experiencing elevated failures or a policy issue
**When** I degrade/disable the connector
**Then** the product stops attempting unsupported/unsafe Connected actions
**And** affected user flows degrade to capability-honest states (e.g., Assisted/link-out where applicable)
**And** users can see the connector’s operational status in the marketplace directory


