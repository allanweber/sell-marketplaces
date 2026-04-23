---

## stepsCompleted: [1, 2, 3]
inputDocuments: []
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'Marketplace posting APIs (Facebook Marketplace / Marktplaats / eBay NL + Mercado Livre / OLX BR) + connector architecture + policy-safe fallback flows'
research_goals: 'How to integrate with marketplace APIs and design fallbacks (share kit, browser extension), and how to structure the application (connector architecture) for NL + BR.'
user_name: 'Allan'
date: '2026-04-22'
web_research_enabled: true
source_verification: true

# Research Report: technical

**Date:** 2026-04-22
**Author:** Allan
**Research Type:** technical

---

## Research Overview

[Research overview and methodology will be appended here]

---

## Technical Research Scope Confirmation

**Research Topic:** Marketplace posting APIs (Facebook Marketplace / Marktplaats / eBay NL + Mercado Livre / OLX BR) + connector architecture + policy-safe fallback flows
**Research Goals:** How to integrate with marketplace APIs and design fallbacks (share kit, browser extension), and how to structure the application (connector architecture) for NL + BR.

**Technical Research Scope:**

- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-04-22



## Technology Stack Analysis

### Programming Languages

For a solo 2‑week MVP that spans **web app + background jobs + (possible) browser extension**, a single-language full-stack approach reduces coordination cost and speeds iteration. **TypeScript** is the most pragmatic default because it works across backend, frontend, and extension code, and has strong ecosystem support for queues/workers and web frameworks.

*Popular Languages*: TypeScript/JavaScript for full-stack web + integrations; Python is viable but becomes a second ecosystem if you also build an extension.
*Emerging Languages*: Not central for this MVP; prioritize maturity and integration libraries.
*Language Evolution*: Browser extensions and modern web stacks continue to standardize around TypeScript for maintainability.
*Performance Characteristics*: Integration workloads are I/O-bound; async runtimes + queue workers matter more than raw compute.
*Source*: [https://bullmq.io/](https://bullmq.io/)

### Development Frameworks and Libraries

**Frontend**: Next.js is a strong default for fast UI + auth + deployment workflow. If you want a thinner API-only service, pair a minimal API framework (Hono/Express/Fastify) with a separate frontend, but for solo speed, a single Next.js app with a separate worker process is often the simplest.

**Backend / API**:

- **Next.js route handlers** (fast to ship) or **a small Node API** (clean separation). Either way, keep “marketplace connector execution” out of the request path and in the queue worker.

**Browser extension (fallback flows)**:

- Use **Manifest V3** architecture (service worker + content scripts + message passing) and keep permissions minimal (“activeTab”/runtime host permissions) to reduce review friction. Chrome’s extension best-practices and API reference remain the baseline, and Firefox continues MV3 evolution.  
*Source*: [https://developer.chrome.com/docs/webstore/best-practices](https://developer.chrome.com/docs/webstore/best-practices)  
*Source*: [https://developer.chrome.com/docs/extensions/reference/api](https://developer.chrome.com/docs/extensions/reference/api)  
*Source*: [https://blog.mozilla.org/addons/2024/05/14/manifest-v3-updates/](https://blog.mozilla.org/addons/2024/05/14/manifest-v3-updates/)

### Database and Storage Technologies

**Relational database (PostgreSQL)** should be the system-of-record for:

- users, marketplace auth tokens, connector configs
- canonical listings (your internal schema)
- publish attempts (audit trail, errors, external IDs/URLs)

**Redis** is the typical queue backbone when using BullMQ (jobs, retries, scheduling). BullMQ is Redis-backed and designed for background job processing in Node.js/TypeScript.  
*Source*: [https://bullmq.io/](https://bullmq.io/)

### Development Tools and Platforms

**Background jobs / orchestration**

- **BullMQ** for job queues, retries, delayed jobs, and worker separation.  
*Source*: [https://bullmq.io/](https://bullmq.io/)

**API resilience patterns (critical for marketplace integrations)**

- Implement **retry with exponential backoff** (plus jitter) and respect provider guidance; don’t retry non-transient failures.  
*Source*: [https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)

**Idempotency**

- Use idempotency keys for “create listing” style operations where retries might duplicate a listing. Stripe’s idempotency guidance is a good reference model even if a marketplace API doesn’t support it natively (implement idempotency on your side by de-duping on a stable key).  
*Source*: [https://docs.stripe.com/api/idempotent_requests](https://docs.stripe.com/api/idempotent_requests)

### Cloud Infrastructure and Deployment

For a 2‑week solo MVP, bias toward managed services:

- **App hosting**: a managed platform that supports Node (and ideally Next.js) plus environment variable management.
- **Postgres**: managed Postgres (avoid ops).
- **Redis**: managed Redis for BullMQ.

If you separate API/web and worker:

- **Web/API** scales on request volume
- **Worker** scales on job backlog; run at least 1 instance for reliability

*Source*: [https://bullmq.io/](https://bullmq.io/)

### Technology Adoption Trends (applied to this project)

**Key adoption pattern for “connector” products**:

- Use a queue worker for all external API calls
- Normalize errors and rate limits centrally
- Design connector contracts so “API connector” and “fallback connector” (share kit / extension-assisted) can share the same canonical listing schema

**Confidence notes**

- High confidence: MV3 constraints and extension architecture basics (Chrome docs + Mozilla updates)
- High confidence: queue-backed worker architecture and BullMQ/Redis approach (BullMQ docs)
- High confidence: retries/backoff and idempotency as standard integration patterns (AWS + Stripe docs)

## Integration Patterns Analysis

### API Design Patterns

**Pattern: “Canonical listing → per-marketplace adapter mapping → async publish job” (recommended)**

- Use your app’s **canonical listing schema** as source-of-truth.
- Convert canonical → marketplace payload via a connector-specific mapper.
- Execute publishing in a **worker job** (queue), not in the HTTP request.
- Record a **PublishAttempt** (audit trail) with normalized errors and the external listing ID/URL.

**Marketplace API reality check (posting support + access model)**

- **eBay (global, incl. NL)**: Official Sell APIs support listing workflows via the Inventory API (inventory item → offer → publish). OAuth 2.0 user tokens are required.  
*Source*: [https://developer.ebay.com/api-docs/sell/inventory/resources/offer/methods/createOffer](https://developer.ebay.com/api-docs/sell/inventory/resources/offer/methods/createOffer)  
*Source*: [https://developer.ebay.com/develop/guides-v2/authorization](https://developer.ebay.com/develop/guides-v2/authorization)
- **Marktplaats (NL)**: Official Marktplaats API 2.0 docs include advertisement endpoints for create/update/delete and category/attribute discovery. Access is not necessarily “open self-serve” for every use case; Marktplaats Pro points users toward certified API partners, which implies commercial/access gating in practice.  
*Source*: [https://api.marktplaats.nl/docs/v2/overview.html](https://api.marktplaats.nl/docs/v2/overview.html)  
*Source*: [https://api.marktplaats.nl/docs/v2/advertisement.html](https://api.marktplaats.nl/docs/v2/advertisement.html)  
*Source*: [https://help.marktplaats.nl/s/article/beheren-advertenties-marktplaats-pro-api-feed](https://help.marktplaats.nl/s/article/beheren-advertenties-marktplaats-pro-api-feed)
- **Mercado Livre / MercadoLibre (BR)**: Official developer docs cover item resources; creating listings is done via `/items` with OAuth (Bearer tokens).  
*Source*: [https://developers.mercadolibre.com.ni/en_us/items-and-searches](https://developers.mercadolibre.com.ni/en_us/items-and-searches)  
*Source*: [https://developers.mercadolibre.com](https://developers.mercadolibre.com)
- **OLX Brazil**: OLX provides an “API de Integração de Anúncios” for importing/managing ads (professional/integrator model).  
*Source*: [https://developers.olx.com.br/anuncio/api/home.html](https://developers.olx.com.br/anuncio/api/home.html)  
*Source*: [https://developers.olx.com.br/anuncio/home.html](https://developers.olx.com.br/anuncio/home.html)
- **Facebook Marketplace**:
  - There is **no general public API** for individuals to post organic Marketplace listings.
  - Meta provides **Marketplace Partner APIs** (Item API / Seller API) that are **restricted to approved partners**.  
  *Source*: [https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/)  
  *Source*: [https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI/](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI/)

**Implication for your MVP**: you should plan for **“APIs where possible + fallbacks”** with Facebook very explicitly treated as **partner-only** unless/until you obtain access. Your earlier “hybrid FB flow” is the safest default.

**Recommended connector contract (v1)**

- `authorize()` → returns token metadata + expiry
- `listCategories()` / `listAttributes(categoryId)`
- `validateMapping(canonicalListing)` → returns missing fields + suggested fixes
- `publish(canonicalListing)` → returns `{ externalId, externalUrl, status }`
- `getStatus(externalId)` → returns normalized status (optional for MVP)
- `deleteOrDeactivate(externalId)` → best-effort (often post-MVP)

**Idempotency and duplication control**

- Use a stable internal key like `publishKey = hash(listingId + marketplace + price + title + primaryPhotoHash)` and enforce one active publish attempt per key.
- If the marketplace supports idempotency keys, pass them; otherwise, dedupe internally and avoid replaying publish jobs.
*Source*: [https://docs.stripe.com/api/idempotent_requests](https://docs.stripe.com/api/idempotent_requests)

### Communication Protocols

**External marketplaces** are overwhelmingly HTTP(S) + JSON with OAuth tokens (or partner tokens). Your internal services should also default to HTTP + JSON for simplicity; use queue messages (Redis/BullMQ) for async work dispatch.

For the browser extension fallback:

- **Content script** reads the canonical listing payload (sanitized) and writes into DOM fields.
- **Service worker** holds minimal state and coordinates user-triggered actions through message passing.
*Source*: [https://developer.chrome.com/docs/extensions/reference/api](https://developer.chrome.com/docs/extensions/reference/api)

### Data Formats and Standards

**Canonical schema**: JSON in your DB + API. Include explicit, typed fields for:

- price/currency, condition, category, location, shipping/pickup options
- photos array with variants (original + resized)
- per-marketplace mapping state (category IDs, attribute IDs/values)

**Marketplace payloads**: JSON; support attachments/images as multipart or pre-upload steps depending on marketplace.

**Fallback flows**:

- **Share kit**: generated plaintext (titles/descriptions) + image ZIP (JPG/WEBP variants) + deep links.
- **Extension**: JSON payload stored locally (`chrome.storage.local`) and injected into target pages on user action.
*Source*: [https://developer.chrome.com/docs/webstore/best-practices](https://developer.chrome.com/docs/webstore/best-practices)

### System Interoperability Approaches

**Recommended**: Point-to-point integrations behind a **connector boundary** (per marketplace). Avoid a heavyweight ESB/mesh for the MVP.

Use an internal **API boundary** like:

- `POST /listings/:id/publish` → enqueues jobs for marketplaces
- `GET /listings/:id/publish-attempts` → status + URLs

### Microservices Integration Patterns

For a solo MVP, keep deployment simple:

- **Web/API app** (Next.js)
- **Worker process** (BullMQ consumer)
- **Postgres + Redis**

Add microservice-style rigor without microservice overhead:

- Per-connector modules with strict interfaces
- Central retry/backoff policy and rate-limit budgeter per marketplace
*Source*: [https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)

### Event-Driven Integration

Use the queue as your event backbone:

- `listing.publish.requested`
- `listing.publish.succeeded` / `listing.publish.failed`
- `marketplace.token.refresh.requested`

This keeps UI responsive and makes retries safe and observable.
*Source*: [https://bullmq.io/](https://bullmq.io/)

### Integration Security Patterns

**OAuth 2.0 (user tokens)**: required by eBay and common for other platforms; store refresh tokens encrypted at rest and rotate keys.
*Source*: [https://developer.ebay.com/develop/guides-v2/authorization](https://developer.ebay.com/develop/guides-v2/authorization)

**Extension security**:

- No remote code execution; strict CSP.
- Minimize host permissions; request runtime permissions when needed.
*Source*: [https://developer.chrome.com/docs/webstore/best-practices](https://developer.chrome.com/docs/webstore/best-practices)

### Confidence levels (marketplace posting feasibility)

- **eBay Sell APIs (posting)**: **High confidence** (official docs, stable dev program)
- **Marktplaats posting via API**: **Medium confidence** (official docs exist; access/commercial gating likely)
- **Mercado Livre (posting)**: **High confidence** (official developer platform for items)
- **OLX Brazil (posting)**: **Medium–High confidence** (official integration docs; integrator/pro model)
- **Facebook Marketplace posting (general)**: **Low confidence** for open access; **High confidence** that it is partner-restricted (official partner docs)

## Architectural Patterns and Design

### Modular Monolith + Async Worker (recommended, focused)

This project is a great fit for a **modular monolith** (single codebase, clear module boundaries) plus an **async worker** (queue consumer) that performs all marketplace I/O.

#### Deployable units (minimum)

- **Web/API app**: UI + auth + canonical listing CRUD + “publish” orchestration (enqueue jobs, read status).
- **Worker**: executes connector jobs (publish/status refresh/token refresh), applies rate limits + retries.
- **Data**: Postgres as system-of-record + Redis as queue backend (if using BullMQ).

#### Module boundaries inside the monolith (keep these strict)

- **Core domain**: canonical `Listing` model + publish intent + normalized status/errors.
- **Connectors** (one module per marketplace): mapping + auth + API client + publish/status functions.
- **Publish orchestrator**: creates jobs, enforces idempotency, aggregates per-marketplace results.
- **Policy/limits**: per-marketplace budgets (rate limits, concurrency) and retry rules.

This keeps marketplace details from leaking into core logic and reduces “integration entropy”.

#### Connector contract (ports)

- `authorize()` / `refreshToken()` (if applicable)
- `mapAndValidate(listing)` → missing fields + per-marketplace required attributes
- `publish(listing)` → `{ externalId, externalUrl, status }`
- `getStatus(externalId)` (optional MVP)

#### Async worker patterns that matter for marketplace APIs

**Queue-based load leveling (must-have)**: use the queue as a buffer so spikes in user activity don’t overload marketplaces.  
*Source*: [https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling)

**Backpressure + rate limiting (must-have)**:

- per-marketplace concurrency caps in the worker
- per-marketplace rate limiting (token bucket / leaky bucket style)
- respect 429 + Retry-After; exponential backoff + jitter on transient failures

**Idempotency (must-have)**:

- compute a stable `publishKey` and ensure only one publish attempt per marketplace per key
- store publish attempts with correlation IDs; never “fire and forget” without persistence

#### Minimal data model seams

- `Listing` + `ListingPhoto`
- `MarketplaceAccount` (OAuth tokens/scopes, encrypted at rest)
- `PublishAttempt` (request → job → result, normalized error + external URL/ID)

#### Security notes (only what’s essential for this architecture)

- Store marketplace refresh tokens server-side; don’t place long-lived tokens in the browser/extension.
- Minimize extension permissions; treat extension as a fallback UX tool, not a secrets container.

#### Practical 2-week MVP recommendation (ties to your earlier plan)

- Ship with **2 marketplaces fully API-based** (eBay + Marktplaats if access is granted), and treat Facebook as **fallback-first** unless you have partner access.
- Keep the connector contract stable so BR (Mercado Livre + OLX) becomes “add connectors + add country pack” later without refactoring core.

