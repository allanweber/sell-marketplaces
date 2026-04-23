---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-01b-continue
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-sell-items.md
  - _bmad-output/brainstorming/brainstorming-session-2026-04-22-142534.md
  - _bmad-output/planning-artifacts/research/technical-marketplace-integrations-nl-br-research-2026-04-22-174138.md
  - _bmad-output/planning-artifacts/research/market-sell-items-crosslisting-research-2026-04-22.md
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 2
  brainstorming: 1
  projectDocs: 0
classification:
  projectType: "mobile_app + web_app"
  domain: "general"
  complexity: "medium-high"
  projectContext: "greenfield"
---

# Product Requirements Document - sell-items

**Author:** Allan
**Date:** 2026-04-22

## Executive Summary

`sell-items` is a consumer “selling cockpit” that helps people sell personal/used goods faster by maintaining **one source of truth** for each item (photos, title, price, description) and distributing/operating that item across multiple marketplaces. The core user outcome is simple: **create once, publish/manage everywhere**, without losing track of what’s listed where or missing buyer questions.

The NL MVP focuses on sellers who multi-home listings (moving/declutter bursts and casual high-value items). The product provides a unified inventory view (“all my items across all marketplaces at once”) plus a single place to write listing content and manage buyer conversations. Because marketplaces differ in API access and policy constraints, `sell-items` treats channels as **Connected vs Assisted**: Connected channels support in-app operations (including **reply-from-sell-items**), while Assisted channels still deliver cross-post value via guided/manual flows and link-outs—without breaking the “one cockpit” mental model.

### What Makes This Special

- **One inventory view across marketplaces**: sellers can see status, links, and next actions per channel for every item in one place.
- **One listing editor**: create and maintain titles, prices, descriptions, and pictures once; propagate (or package) that content per marketplace.
- **Unified inbox experience with honest capability boundaries**: message visibility and reply live in `sell-items` for Connected channels; Assisted channels degrade gracefully to link-out without pretending to be fully integrated.
- **Country-pack strategy**: start by winning a single country’s real marketplaces (NL) instead of generic global breadth, then expand via additional packs.
- **Facebook as a global anchor (Assisted-first)**: treat Facebook Marketplace as a baseline channel across country packs using policy-safe assisted posting, while country packs add additional Connected marketplaces where feasible.

## Project Classification

- **Project Type**: hybrid `mobile_app` + companion `web_app`
- **Domain**: general (consumer resale workflow tooling)
- **Complexity**: medium-high (multi-marketplace integrations + inbox + policy constraints, capability-driven degradation)
- **Project Context**: greenfield

## Success Criteria

### User Success

- **Time-to-cross-post**: A typical NL seller can go from “start listing” to “posted on 2 marketplaces” in **≤ 2 minutes** (median, for a typical item with 3–6 photos).
- **One-cockpit clarity**: Sellers can see **all items across marketplaces in one inventory view**, with per-channel status + listing links, without confusion about what is Connected vs Assisted.
- **Inbox usefulness (Connected channels)**: Sellers can **read + reply** from `sell-items` for Connected channels, with clear delivery state (sending/delivered/failed).

### Business Success

- **Activation**: **≥ 5%** of signups publish **1 item to 2 marketplaces** within **24 hours**.
- **30-day retention**: **≥ 10%** of sellers list again within 30 days.
- **Revenue (first 90 days)**: reach either **€1,000 MRR** *or* **100 paid users**.  
  - Assumption: “100 paid users” implies an average paid price point around €10/mo; we’ll refine pricing later.

### Technical Success

- **Publish reliability**: After retries, per-channel publish attempts result in a user-visible success state with **< 5%** “failed and requires support intervention” outcomes.
- **Inbox freshness (Connected channels)**: message sync delay **≤ 10 minutes** (P95), with explicit “last synced” UI and manual refresh.
- **Degradation safety**: Assisted channels never present actions we can’t guarantee (e.g., no “Reply” box unless we can actually send).

### Measurable Outcomes

- **Median time-to-cross-post (2 channels)**: ≤ 2 minutes
- **Activation (24h)**: ≥ 5%
- **Retention (30d)**: ≥ 10%
- **Revenue (90d)**: €1,000 MRR or 100 paid users
- **Publish failure rate (post-retry)**: < 5%
- **Message sync delay (Connected, P95)**: ≤ 10 minutes

## Product Scope

### MVP - Minimum Viable Product

- **Canonical listing**: create/edit item once (photos, title, price, description, category, condition, location, pickup/shipping flags).
- **Connected vs Assisted channel model**:
  - **Connected channels**: publish + status + **reply-from-sell-items** for inbox.
  - **Assisted channels**: listing package + guided steps + deep links; inventory status tracking still exists.
- **Unified inventory view**: all items with per-marketplace status + external links.
- **Inbox (MVP-required for Connected channels)**:
  - Conversation list + thread view + reply + delivery/failure states.
  - Link-out for Assisted channels.
- **Close-out**: “Mark sold” workflow with per-marketplace actions (automated where connected; guided where assisted).
- **NL MVP channel pack (aligned)**:
  - **Marktplaats (Connected)**: publish + status + inbox reply (anchor Connected channel).
  - **Facebook Marketplace (Assisted)**: assisted posting via listing package + deep links (baseline “global anchor” channel).

### UX Alignment (MVP-defining Decisions)

- **Photos-first creation**: item creation starts with photo capture/selection; text fields follow with smart defaults.
- **Save-first + auto-publish**: saving an item creates a durable draft and **auto-starts publishing** in the background for selected channels.
- **Default to broad reach**: marketplace selection defaults to **all marketplaces in the user’s country pack**, with easy opt-out per channel.
- **Cockpit-first navigation**: Inventory is the home surface; users can always return to the item + channel rows context after sub-flows.
- **Durable status language** (shown consistently across Inventory, Item, Troubleshooting, Inbox):
  - Publishing / Posted / Action needed / Failed / Not started / Confirmed (Assisted, after URL)
- **Assisted is first-class, but capability-honest**: Assisted channels use a resumable checklist + listing package + deep links; no unsupported actions appear in-app.

### Growth Features (Post-MVP)

- More Connected marketplaces within NL pack; expand “Connected inbox” coverage.
- Pricing guidance, listing quality checks, smarter category/attribute mapping.
- Faster bulk listing modes (moving/declutter sessions), templates, and reply snippets.
- **Garage sale / sell-a-lot mode**: bulk capture, bundle/lot listings, and optional time-windowed “sale mode.”
- **Risky-category review (optional)**: human-in-the-loop review flow for flagged categories (e.g., phones, luxury, tickets, high-value electronics) before publishing to selected channels.
- eBay (optional): add as an additional Connected channel when access + reliability are proven.

### Vision (Future)

- Become the default “selling cockpit” across multiple **country packs** (NL then BR), with consistent inventory + inbox + close-out behavior, and a trustworthy, policy-safe integration posture.
- Maintain a consistent baseline experience via a Facebook Marketplace Assisted flow across packs, even when Connected access differs by country and marketplace policy.

## User Journeys

### Journey 1 — Primary Seller (Success Path): “Declutter Sprint, Listed Everywhere”

**Persona**: moving/decluttering in NL, selling 1–3 items tonight, mostly pickup.  
**Opening scene**: It’s 9pm. They’ve found a chair and a coffee table they won’t move. They dread retyping and re-uploading photos across apps.  
**Rising action**:

- Opens `sell-items`, taps **New Item**, snaps 4 photos, adds title/price/condition, chooses **Pickup (default)** and sets a neighborhood/approx location.
- On **Marketplaces**, they pick two: one **Connected**, one **Assisted** (clearly labeled).
- `sell-items` shows a short checklist: “2 required fields” for the Connected one, “Assisted posting steps” for the Assisted one.

**Climax**: They tap **Publish**.

- Connected marketplace returns **Posted** + link.
- Assisted marketplace generates a **listing package** (copy + photos) and deep-links them to finish posting in under a minute.

**Resolution**:

- They land in **Inventory**, see one item with two channel rows, both with status + links.
- A buyer messages on the Connected channel; they open **Inbox** and **reply from sell-items**.
- After pickup, they tap **Mark Sold** and follow the close-out actions per channel.

**What could go wrong / recovery**

- Publish fails (rate limit / validation): show “Fix missing field” or “Retry later,” preserve draft, show trace ID in self-serve.
- Assisted channel not completed: show “Not finished” + reminder + deep link back to posting.

### Journey 2 — Primary Seller (Edge Case): “Two Buyers, One Item”

**Opening scene**: The item is posted on 2–3 marketplaces. Two buyers reach out close together.  
**Rising action**:

- Inbox shows two conversations (Connected) and a link-out indicator (Assisted).
- Seller schedules pickup with Buyer A (Connected), but Buyer B (Assisted) also claims it.

**Climax**: Seller marks the item as **Pending pickup** (or equivalent state) and later **Sold**.  
**Resolution**:

- `sell-items` prompts a close-out checklist per marketplace:
  - Connected: attempt automated “mark as sold / end listing.”
  - Assisted: open listing and guide the exact steps to end it.
- Seller sends a polite decline message template (Connected) and gets a link-out suggestion for Assisted.

**What could go wrong / recovery**

- Double-selling risk: when “Sold” is set, `sell-items` warns: “Some channels may still be active—complete close-out steps now.”
- Message delivery uncertainty: clear delivered/failed state; if failed, show “open marketplace to confirm.”

### Journey 3 — Seller (Assisted-first reality): “Connected Works, Assisted is a Checklist”

**Opening scene**: Seller wants Facebook/equivalent exposure, but it’s Assisted.  
**Rising action**:

- They publish; Connected succeeds; Assisted shows “Finish posting (2 steps).”
- They download/copy the listing package and complete the flow.

**Climax**: They paste/post successfully and come back to `sell-items`.  
**Resolution**:

- They paste the external listing URL to **confirm posted**, moving the Assisted channel row into **Confirmed** state (honest tracking).
- Inventory now shows consistent status across channels.

**What could go wrong / recovery**

- Seller forgets to finish Assisted flow: reminders + “Resume assisted posting” button.
- URL/status mismatch: allow manual correction and flag for monitoring.

### Journey 3B — Bulk Seller: “Garage Sale / Sell-a-Lot in One Sitting”

**Persona**: decluttering weekend / “garage sale” style seller with many low-to-mid value items.  
**Opening scene**: They want to list 10–30 items quickly and don’t want to repeat work or lose track of what sold.  
**Rising action**:

- They enter a bulk listing mode to capture photos fast and create multiple drafts with minimal fields.
- They optionally create **bundles/lots** (e.g., “kids toys bundle”) and choose a time window for the sale.
- They publish to Marktplaats (Connected) and generate Facebook listing packages (Assisted) for several items.

**Climax**: Multiple buyers message; they need to keep the queue organized without double-selling.  
**Resolution**:

- Inventory view highlights which items are “action needed,” “pending pickup,” and “sold,” across channels.
- They close out sold items across channels via the checklist.

**What could go wrong / recovery**

- Overwhelm: the system nudges toward templates/snippets and bulk status updates without hiding channel limitations.
- Mistakes in bundles: allow unbundling/splitting before publish, and clear “lot” labeling in inventory.

### Journey 4 — Ops/Admin (Solo): “Keep It Running Without Being On Call”

**Persona**: solo operator.  
**Opening scene**: You need confidence the system isn’t silently failing for users.  
**Rising action**:

- You open an **Admin / Ops dashboard** (even if gated/hidden):
  - publish job backlog, per-marketplace error rate, retries, token refresh failures
  - inbox sync lag (P95), webhook failures, rate-limit events
  - top failing validation causes (e.g., missing category mapping)

**Climax**: An error spike triggers an alert: “Connected publish failures > 5% in 30 min.”  
**Resolution**:

- You can drill into a failed attempt (audit trail), see normalized error + marketplace response.
- You can disable a connector temporarily (“degrade to Assisted mode”) to protect user trust.

**What could go wrong / recovery**

- No visibility → support nightmare. MVP requires **structured logging + trace IDs + dashboards** from day one.

### Journey 5 — Self-Serve Support (with rare human intervention): “Help Me Fix This Without Emailing You”

**Opening scene**: Seller sees “Publish failed” or “Messages not syncing.” They don’t want to contact support.  
**Rising action**:

- `sell-items` shows a **self-serve troubleshooting panel**:
  - what failed (human-readable)
  - what to do next (fix field / reconnect account / retry later)
  - current connector status (“Degraded mode: Assisted”)
  - last sync time, retry schedule, and a “Retry now” button where safe

**Climax**: They resolve it (fix missing info or re-auth) and retry successfully.  
**Resolution**:

- If still blocked, they can generate a **support bundle** (diagnostics + trace IDs) and a minimal contact path for “extreme cases.”

**What could go wrong / recovery**

- Ambiguous errors: rewrite into actionable steps; never show raw API errors as the only message.
- Repeated failures: suggest switching marketplace mode (Assisted) temporarily.

### Journey Requirements Summary

- **Inventory cockpit**
  - Canonical listing editor
  - Per-item, per-marketplace status + links
  - Clear **Connected vs Assisted** labeling + capability-based UI
- **Publishing**
  - Async publish jobs with retries, idempotency, and user-visible outcome states
  - Assisted listing package generation + deep links + “resume” flow + URL capture for **confirm posted**
- **Inbox**
  - Connected-channel inbox: list + thread + reply + delivery receipts + sync freshness
  - Assisted-channel link-out (and optional visibility if feasible later)
- **Close-out / anti-double-sell**
  - Mark sold / pending states and per-channel close-out checklist
- **Ops + self-serve**
  - Monitoring dashboards, alerting, audit trail/trace IDs
  - In-product troubleshooting and a minimal escalation path

## Domain-Specific Requirements

### Compliance & Regulatory

- **GDPR baseline (NL/EU)**:
  - **Data minimization**: store only what’s required to operate the product (especially around messaging, where we store metadata only).
  - **Right to deletion**: user can request **“delete all”** (account + listings + stored marketplace metadata + addresses + logs tied to the user, subject to minimal operational retention).
  - **Consent and transparency**: clear disclosure of what is stored per marketplace and what is not (e.g., “message content not stored; only metadata and deep links”).
- **Marketplace policy compliance (ToS/policy constraints)**:
  - The product must explicitly support **Connected vs Assisted** capabilities and avoid “fragile automation” patterns where prohibited.
  - Capability labels must be **honest and enforceable** in the UI (no “reply” UI if reply isn’t supported).

### Technical Constraints

- **Messaging data handling**:
  - Store **message metadata only** (e.g., marketplace, thread ID, timestamps, unread count, last message snippet *only if permitted*; otherwise none), and provide **deep links** for full thread handling where required.
- **Address handling**:
  - Store **pickup address**, but apply strong controls:
    - Encrypt at rest; strict access control; limit exposure in UI (mask until needed).
    - Prefer collecting **approx area by default** with an optional “share exact address later” pattern (reduces safety risk).
- **Account deletion (“delete all”)**:
  - Implement a “hard delete” workflow for user-owned data (including address), plus connector token revocation where possible.
  - Define a minimal retention policy for operational logs (e.g., keep redacted aggregates/metrics, delete user identifiers).
- **No payments escrow**:
  - Product must clearly state: **`sell-items` does not escrow or guarantee payments** and does not provide buyer protection.
  - Any safety guidance must be framed as guidance, not guarantees.

### Integration Requirements

- **Token safety**:
  - For Connected channels requiring auth, store tokens securely (encrypted at rest, rotate keys, least privilege scopes).
- **Auditability & supportability**:
  - Every publish/sync attempt produces an audit record with a trace ID suitable for self-serve troubleshooting and rare human intervention.
- **Degradation controls**:
  - Ability to “degrade” a connector from Connected → Assisted operationally (admin kill switch) if policy or reliability issues emerge.

### Risk Mitigations

- **Personal safety risk (pickup address)**:
  - Encourage safe-meetup guidance (public pickup points, daylight, etc.).
  - Default UX: don’t force exact address early; provide “share later” messaging templates.
- **User trust risk (capability mismatch)**:
  - Connected vs Assisted must be obvious at selection time, publish time, and in Inventory/Inbox.
- **Policy enforcement risk**:
  - Prefer official APIs; rate limiting; avoid prohibited automation; be transparent about what is and isn’t automated.

## Innovation & Novel Patterns

### Detected Innovation Areas

- **Capability-driven “Connected vs Assisted” UX as a first-class product concept**: `sell-items` makes capability limits explicit and designs graceful fallbacks so the product remains trustworthy even when marketplaces are constrained.
- **Inventory cockpit as the primary object (not “listings per marketplace”)**: a single canonical item is the unit of work; each marketplace is a “channel row” with status, link, and next action.
- **Inbox unification without storing message content (privacy + policy posture)**: a unified workflow inbox that still functions with **metadata + deep links** (and Connected replies where supported).
- **Self-serve reliability + ops-first MVP (solo operator)**: observability, connector kill-switch/degrade mode, and user-facing troubleshooting as MVP requirements.

### Market Context & Competitive Landscape

- Incumbent marketplaces optimize for single-channel selling and don’t help multi-homing sellers.
- Cross-listing tools prove “list once” demand, but commonly struggle with country-specific channel coverage and reliability, and often don’t handle capability constraints transparently.

### Validation Approach

- **Validate “cockpit value”**:
  - Time-to-cross-post (target: **≤ 2 minutes** for 2 channels)
  - “I didn’t miss a buyer” proxy: unread → replied cycle time on Connected channels
  - Multi-homing completion: % of users who finish Assisted posting steps after starting them
- **Validate trust in capability boundaries**:
  - Drop-off at marketplace selection when a channel is Assisted (should be low if framing is good)
  - Support burden: self-serve resolution rate for publish/inbox issues
- **Validate willingness-to-pay**:
  - Conversion to paid after a small free allowance tied to visible time saved + reduced chaos

### Risk Mitigation

- **Policy/API fragility**: keep Connected vs Assisted switchable per connector; degrade safely without breaking the product.
- **User confusion**: capability labels at selection + publish + inventory + inbox; never show unsupported actions.
- **Privacy/safety**: metadata-only messaging storage; “no escrow” disclaimer; safe pickup guidance; delete-all support.

## Mobile App + Web App Specific Requirements

### Project-Type Overview

`sell-items` ships as a **React Native mobile app** plus a **full-featured parity web app**. The product must provide a consistent “selling cockpit” experience across both surfaces: canonical listing creation, inventory cockpit, Connected vs Assisted publishing flows, and Connected inbox reply (where supported), with strong self-serve troubleshooting.

### Technical Architecture Considerations

- **Single domain model**: canonical item is the unit of work; marketplaces are channel rows with capability flags (Connected vs Assisted).
- **Capability-driven UI**: mobile and web must share the same capability truth source so neither client exposes unsupported actions.
- **Offline-first data layer**:
  - Users can **create/edit listings offline** (including photos queued for upload).
  - Publishing is queued and clearly stateful (e.g., “Ready to publish” vs “Waiting for connection”).
  - Conflict resolution rules: last-write-wins for simple fields; explicit user choice if edits diverge after reconnect.
- **Push + realtime**:
  - Push notifications are required for key events (e.g., new message on Connected channel, publish result, action-needed).
  - In-app realtime (SSE/WebSocket) is preferred; polling fallback where needed.

### Platform Requirements (Mobile)

- **Supported platforms**: iOS + Android (React Native).
- **Distribution**: app stores (store compliance required); web remains available as a full parity surface.
- **Performance**: photo capture and listing creation must feel instant; background upload should be resilient to app suspend/resume.

### Device Permissions / Features

- **Required**:
  - Camera (capture photos)
  - Photo library access (select existing photos)
  - Notifications (push)
- **Optional / progressive** (ask only when a feature is used):
  - Location (for approximate pickup area; avoid requiring precise location by default)
  - Share sheet integrations (export listing package)
- **Privacy stance**: collect the least sensitive variant by default (approx area first; exact address later).

### Offline Mode

- **Offline listing creation/editing**: must work fully offline for text fields and photo capture.
- **Deferred uploads**: photos and drafts sync when connected; show per-item sync state.
- **Publish gating**: publishing requires connectivity; app should queue publish intents and execute when online (with clear user confirmation rules).

### Push Strategy

- **Must notify**:
  - New inbound message (Connected channels only)
  - Publish succeeded/failed/action required
  - Assisted posting reminder (“Finish posting”)
- **User controls**: notification preferences (at minimum: on/off + quiet hours later).

### Store Compliance

- No prohibited automation behaviors; marketplace ToS compliance and transparent capability labeling.
- Clear privacy policy: what data is stored (metadata-only messages, address handling) + “no escrow” disclaimer.

### Web App Requirements

- **Browser matrix**: modern evergreen browsers (Chrome/Edge/Firefox/Safari) with a mobile-responsive UI.
- **Responsive design**: first-class mobile web layout; desktop web supports faster editing and cockpit overview.
- **Performance targets**:
  - Fast first load for core flows (inventory + create listing)
  - Image handling optimized (compression/resizing, background upload)
- **SEO strategy**: not a core requirement for the app experience (authenticated cockpit), but landing/marketing pages can be SEO-oriented later.
- **Accessibility level**: **WCAG 2.1 AA** across both mobile and web experiences (forms, contrast, focus, error messaging, keyboard nav on web).

### Implementation Considerations

- **Shared behavior across clients**: validate listing requirements and marketplace constraints server-side, but surface actionable errors client-side.
- **Self-serve monitoring hooks**: both clients must expose trace IDs and “export diagnostics” for rare escalations.
- **Security**: marketplace tokens server-side only; clients never store long-lived secrets.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

- **MVP Approach**: **Experience + Reliability MVP**  
  Prove the “selling cockpit” is meaningfully better than copy/paste by delivering: a single canonical listing, cross-post to **Marktplaats (Connected) + Facebook Marketplace (Assisted)** fast, a trustworthy inventory cockpit, a usable inbox for the anchor Connected channel, and self-serve + monitoring so the system is operable as a solo founder.
- **Resource Requirements**: solo-friendly, but integration-heavy. Treat “Connected vs Assisted” and operability (monitoring + degradation) as first-class MVP requirements.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported**

- Primary seller success path: create once → publish to **Marktplaats (Connected) + Facebook Marketplace (Assisted)** → see status/links → reply to buyer on Connected channel → mark sold and close-out.
- Primary seller edge case: two buyers / prevent double-sell via clear close-out checklist.
- Solo ops/admin: monitor connector health; degrade connectors safely.
- Self-serve support: user can fix common failures without contacting you.

**Must-Have Capabilities**

- Canonical listing editor (photos, title, price, description, category, condition, location, pickup/shipping).
- **Offline-first** draft creation/editing + queued publishing once online.
- **Marketplace selection UI** with **Connected vs Assisted** capability badges and enforced action availability.
- **Publishing** to **Marktplaats (Connected)** plus a **Facebook Marketplace (Assisted)** flow with async jobs, retries, idempotency, and user-visible outcomes.
- **Inventory cockpit**: per-item channel rows (status, link, next action).
- **Inbox (Connected anchor = Marktplaats)**:
  - reply-from-sell-items + delivery receipts + sync freshness (metadata-only storage, deep links when needed).
- **Close-out flow**: mark sold + per-marketplace actions/checklist.
- **Push notifications** for publish outcomes + Connected message events + Assisted reminders.
- **Self-serve troubleshooting**: actionable errors + trace IDs + “retry” where safe.
- **Ops monitoring**: error rates, backlog, token issues, sync lag; connector kill-switch / degrade mode.
- **Compliance baseline**: GDPR delete-all, address encryption/controls, no-escrow disclaimer, WCAG 2.1 AA.

### Post-MVP Features

**Phase 2 (Growth)**

- Add/upgrade additional Connected capabilities (e.g., extend inbox coverage, improve status sync, better close-out automation).
- Assisted channel improvements (faster completion, URL auto-detect, smarter reminders).
- Listing quality engine (photo checks, policy linting), pricing guidance.
- Templates/snippets for replies; richer filtering in inventory/inbox.

**Phase 3 (Expansion)**

- Add more country packs (e.g., BR) and category playbooks.
- More advanced workflow modes (moving sessions, bulk capture).
- Stronger trust/safety UX (meetup guidance, scam warnings), without becoming a payments intermediary.

### Risk Mitigation Strategy

- **Technical risks**: integrations + inbox reliability  
  Mitigate via async jobs, audit trail, capability flags, and connector degrade mode.
- **Market risks**: users won’t pay / don’t multi-home enough  
  Mitigate via time-saved instrumentation, tight activation funnel, and fast onboarding to the “2-minute cross-post” moment.
- **Resource risks**: solo capacity  
  Mitigate by scoping inbox to **one Connected anchor** initially and requiring self-serve + monitoring in MVP.

## Functional Requirements

### Account & User Management

- FR1: Users can create an account and sign in/out.
- FR2: Users can manage their profile basics (name, locale, defaults).
- FR3: Users can view and manage connected marketplace accounts (“channels”).
- FR4: Users can disconnect a marketplace account.
- FR5: Users can initiate an account deletion (“delete all”) request.

### Marketplace Channels (Connected vs Assisted)

- FR6: Users can browse available marketplaces for their country pack.
- FR7: Users can see whether a marketplace is Connected or Assisted and what actions are supported for each.
- FR8: System can enforce capability-based behavior (only offer actions supported by that channel).
- FR9: Users can complete an authorization/connection flow for Connected marketplaces (where supported).
- FR10: Users can set the external listing URL for Assisted postings as part of “confirm posted,” enabling the item’s Assisted channel row to enter **Confirmed** state (**URL is required for Confirmed**; no “manual confirm” without a URL).

### Canonical Listing (Item) Management

- FR11: Users can create a canonical item listing with core fields (title, description, price, category, condition).
- FR12: Users can add/remove/reorder item photos.
- FR13: Users can edit any canonical item and save changes.
- FR14: Users can duplicate an item to speed up similar listings.
- FR15: Users can archive/unarchive items.
- FR16: Users can set selling logistics per item (pickup/shipping flags, location/area).
- FR17: Users can track each item’s lifecycle state (draft/ready/active/pending/sold).

### Drafts, Offline, and Sync States

- FR18: Users can create and edit drafts without immediate publishing.
- FR19: System can represent per-item sync/publish states clearly (e.g., needs action, queued, succeeded, failed).
- FR20: Users can resume an interrupted listing flow without losing entered content.

### Publishing & Cross-Posting

- FR21: Users can select one or more marketplaces to publish an item to.
- FR22: System can validate an item against selected marketplace requirements and surface what’s missing.
- FR23: Users can publish to Connected marketplaces and receive a clear success/failure result per channel.
- FR24: Users can initiate an Assisted posting flow that provides a “listing package” (copy + photos) and deep links to complete posting.
- FR25: System can store and show external listing identifiers/links per marketplace for an item.
- FR26: Users can re-try a failed publish attempt where safe.
- FR27: System can maintain an audit trail of publish attempts per item/channel (for user-visible troubleshooting).
- FR28: System can flag an item as “risky category” based on rules and require an optional review step before publishing to selected channels.
- FR29: Users can request a human-in-the-loop review for a flagged item and see the review status (pending/approved/rejected) with required changes.
- FR30: Admin/Reviewer can review a flagged item and approve/reject it with a reason and required changes.

### Inventory Cockpit

- FR31: Users can view a unified inventory list of all items.
- FR32: Users can view per-item, per-marketplace “channel rows” showing status and external links.
- FR33: Users can filter/sort inventory by state (draft/active/sold), marketplace, and action-needed.
- FR34: Users can see a clear “next action” per channel (e.g., finish Assisted posting, reconnect, retry).

### Navigation & Layout (Mobile + Web)

- FR55: The app uses bottom-tab navigation for primary sections: Inventory (home), Inbox, New Item, and Settings/Ops.
- FR56: Inventory supports an optional “cockpit KPI” header (e.g., posted channels, needs action) that can be tapped to apply quick filters.

### Inbox & Buyer Communication

- FR35: Users can view conversations for Connected marketplaces inside the product.
- FR36: Users can open a conversation thread and view message history available to the product.
- FR37: Users can send replies for Connected marketplaces from within the product.
- FR38: System can show delivery state for outbound messages (sent/failed/action needed).
- FR39: Users can deep-link out to the marketplace conversation for Assisted (or unsupported) inbox channels.
- FR40: Users can use reply templates/snippets when responding to buyers.

### Close-Out (Sold / Prevent Double-Sell)

- FR41: Users can mark an item as sold (or pending) in the product.
- FR42: System can generate a per-marketplace close-out checklist for an item when it becomes pending/sold.
- FR43: Users can execute close-out actions per marketplace (automated where Connected supports it; guided where Assisted).
- FR44: System can warn users if some channels are still active when an item is marked sold.

### Notifications & Reminders

- FR45: Users can receive notifications for key events (publish result, new message on Connected channels, assisted “finish posting” reminders).
- FR46: Users can manage notification preferences (at minimum: on/off per type).

### Self-Serve Troubleshooting & Supportability

- FR47: Users can view an in-product troubleshooting panel for failures (publish, sync, messaging).
- FR48: System can present human-readable error reasons and next steps (fix field, reconnect, retry, link out).
- FR49: Users can view or copy a trace/reference ID for a failed operation.
- FR50: Users can export a support bundle (diagnostics) for escalation.

### Admin / Ops Capabilities (Solo Operator)

- FR51: Admin/Ops can view connector health and error rates by marketplace.
- FR52: Admin/Ops can view backlog/lag indicators for background processing and message sync.
- FR53: Admin/Ops can inspect an individual failure/audit record for debugging (normalized error + reference).
- FR54: Admin/Ops can degrade/disable a connector (e.g., switch to Assisted mode) to protect user trust.

## Non-Functional Requirements

### Performance

- NFR1: Inventory list loads in ≤ 2s (P95) for a typical user dataset.
- NFR2: Open item detail completes in ≤ 2s (P95).
- NFR3: Save draft/edit acknowledges in ≤ 1s (P95) (actual background sync may continue).
- NFR4: Photo handling provides responsive feedback (upload/processing state visible) and does not block core navigation.
- NFR5: Inbox conversation list loads in ≤ 3s (P95) and thread open in ≤ 2s (P95) when data is available locally/from sync.
- NFR6: Publish action returns an immediate “queued/processing” confirmation in ≤ 2s (P95), with eventual per-channel outcome state.

### Reliability & Data Integrity

- NFR7: The system provides at-least-once execution semantics for background jobs with safe retries (no silent drops).
- NFR8: Publish attempts are idempotent such that retries do not create duplicate external listings when avoidable.
- NFR9: The system surfaces clear, durable states for publish/sync (queued/succeeded/failed/action needed) that survive app restarts.
- NFR10: Connected-channel message sync exposes last synced timestamp and supports safe manual refresh.
- NFR11: The system preserves drafts and prevents data loss on app crash, network loss, or resume.

### Security & Privacy (GDPR-aligned)

- NFR12: All sensitive data is encrypted in transit (TLS) and at rest.
- NFR13: Marketplace credentials/tokens are stored securely with least privilege and are never exposed as long-lived secrets to clients.
- NFR14: The product implements data minimization for messaging (store only what is required for functionality and policy posture).
- NFR15: Users can trigger account deletion (“delete all”) with completion within a defined operational window (e.g., ≤ 30 days) and clear confirmation.
- NFR16: Access to user data follows least privilege; admin access is gated and audited.
- NFR17: Security-relevant events (auth changes, token failures, publish failures with diagnostics access) are logged with correlation/trace IDs.

### Accessibility

- NFR18: The web app meets WCAG 2.1 AA for core flows (create/edit item, inventory, inbox, troubleshooting).
- NFR19: Critical flows are usable with keyboard navigation on web and with screen readers (labels, focus order, error messaging).

### Integration & Operability

- NFR20: External marketplace integrations must handle rate limits and transient failures using bounded retries and respect provider retry guidance.
- NFR21: The system provides an audit trail for publish/sync operations sufficient for self-serve troubleshooting and rare human intervention.
- NFR22: The operator can degrade/disable a connector safely without breaking the core “inventory cockpit” experience.
- NFR23: Monitoring exists for connector error rates, queue backlog, token refresh failures, and message sync lag, with alert thresholds configurable.

### UX / UI Foundation

- NFR24: The UI uses a calm-neutral foundation with a trust-forward blue primary; semantic status colors are used sparingly (Success/Warning/Error/Info) and meaning is never encoded by color alone (icon + text required).
- NFR25: The system presents publish outcomes as durable, user-legible states per channel row, and provides a single best “next action” CTA wherever an action is required.

