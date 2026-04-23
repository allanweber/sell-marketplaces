---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
lastStep: 14
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-sell-items.md
---

# UX Design Specification sell-items

**Author:** Allan
**Date:** 2026-04-23

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

`sell-items` is a consumer “selling cockpit” that maintains one canonical item (photos + listing data) and operates that item across marketplaces. The UX differentiator is a capability-honest Connected vs Assisted model: users can publish/manage and reply in-app for Connected channels, and complete policy-safe assisted posting/link-out flows for Assisted channels—without breaking the “one cockpit” mental model.

The NL MVP focuses on Marktplaats (Connected anchor) plus Facebook Marketplace as an Assisted-first “global anchor” that can provide a baseline experience across country packs. Growth expands via country packs (e.g., BR) and introduces burst workflows (garage sale / sell-a-lot) and optional human-in-the-loop review for risky categories.

### Target Users

- Primary: NL moving/declutter sellers who list in bursts, are time-poor, and want to avoid duplicated work and missed buyer messages.
- Secondary: casual sellers of higher-value items (electronics, bikes, furniture) who care about trust, safety, and managing buyer conversations.

### Key Design Challenges

- Capability honesty: make Connected vs Assisted unmistakable and enforceable without overwhelming users.
- High-trust status design: provide clear, durable states for publish/sync/inbox so users always know what happened and what to do next.
- Burst workflows: support both quick single-item listing and bulk “sell-a-lot” sessions with minimal cognitive load.

### Design Opportunities

- Make the cockpit (inventory + next actions) the primary experience, not “per-marketplace listing screens.”
- Make Assisted posting feel first-class via a polished listing-package + resume flow.
- Turn reliability/ops constraints into user trust via self-serve troubleshooting, trace IDs, and clear connector status/degraded mode UX.

## Core User Experience

### Defining Experience

The core loop is: **create item → choose channels → publish**, followed by **inbox triage/reply**. The product should feel like a single cockpit where a canonical item becomes multiple channel rows, and the seller can operate the sale without re-entering content or losing track of where things are listed.

Default posture: when a seller creates an item, the system should be ready to publish it broadly (e.g., “all marketplaces in my pack”), while remaining capability-honest about which steps are Connected vs Assisted.

### Platform Strategy

- Primary platforms: **mobile app + parity web app**.
- Mobile should optimize for **photos-first capture** and fast listing creation in real-world contexts (declutter bursts, evening listing sessions).
- Web should provide equal access to core flows and feel optimized for **editing, inventory overview, and inbox triage** (especially on larger screens).
- Users should be able to start on one platform and continue on the other without losing state.

### Effortless Interactions

- Photos-first item creation: capture/select photos quickly, then fill minimal required fields with smart defaults.
- Marketplace publishing with unambiguous outcomes: every publish attempt resolves into a durable state per channel row (queued/succeeded/failed/action needed) with clear next steps.
- “Publish everywhere” behavior: make publishing to all available marketplaces the easy default, with the option to deselect channels (and with Assisted flows packaged and resumable).
- Inbox triage and reply: replying should be fast and context-preserving (item context + buyer context), with clear capability boundaries per channel.

### Critical Success Moments

- The “this is better” moment: the seller sees **one item** represented across marketplaces (channel rows with links/status) immediately after publishing.
- The “I trust this” moment: publish and message actions always produce **clear outcomes** (never ambiguous or silent failures).
- The “I can manage the sale here” moment: the seller can **answer customers from the cockpit**—in-app for Connected channels, and via direct link-out/resume flows for others—without losing track of the item or conversation state.

### Experience Principles

- **Photos-first, words second**: the fastest path starts with capturing the item visually.
- **Publish confidence**: every action produces a clear, durable outcome state with a next step.
- **Default to broad reach**: make “publish to all marketplaces in my pack” the default while allowing easy opt-out per channel.
- **Capability honesty**: never show actions the product cannot guarantee for that channel; Assisted stays first-class via packaged, resumable workflows.
- **Stay in context**: inventory and inbox always keep the seller oriented to the item, the channel, and the next action.

## Desired Emotional Response

### Primary Emotional Goals

- **Empowered**: “I’m in control of my selling process across marketplaces.”
- **Calm**: “Nothing is slipping through the cracks; I can see what to do next.”
- **Success**: “I got my item listed everywhere and I’m handling buyers efficiently.”

### Emotional Journey Mapping

- **First-time use**: curiosity → immediate confidence (“this is set up for me”).
- **During listing/publishing**: calm focus; the product feels guiding, not demanding.
- **After publish**: accomplishment and relief when channel rows show clear outcomes and links.
- **During inbox**: empowered, context-rich conversations; no “where was this buyer?” feeling.
- **When something goes wrong**: calm recovery, not panic—clear explanation, safe next steps, and visibility into what will happen next.

### Micro-Emotions

- **Confidence**: clear states, clear next actions, no ambiguous outcomes.
- **Trust**: capability-honest behavior (Connected vs Assisted), transparent “last synced,” and visible degraded-mode messaging when needed.
- **Accomplishment**: concrete progress indicators (published statuses, “finished assisted posting,” sold/close-out completion).

### Design Implications

- Empowered → inventory cockpit is the “home,” with channel rows that always show status, links, and next actions.
- Calm → default to simple, predictable flows; reduce branching; provide resumable checklists for Assisted.
- Success → celebrate meaningful milestones (first cross-post complete, first in-app reply sent, first item fully closed out).
- Confidence → avoid vague errors; show durable outcomes (queued/succeeded/failed/action needed) and preserve drafts.
- Trust → never show unsupported actions; show freshness (“last synced”), delivery state, and audit/troubleshooting references when needed.

### Emotional Design Principles

- **Clarity beats cleverness**: prioritize unambiguous status over novelty.
- **Progress is visible**: users can always see what’s done, what’s pending, and what’s next.
- **Honest capability boundaries**: Assisted feels first-class, but never pretends to be Connected.
- **Recovery is reassuring**: errors become guided next steps, not dead ends.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

- **eBay**
  - Strength: “broad reach” is clear and motivating; users understand they’ll get exposure.
  - UX takeaway: make reach and distribution feel tangible (channel coverage, listing presence, clear links/status).

- **Etsy**
  - Strength: design quality and perceived simplicity.
  - UX takeaway: calm, curated layouts; progressive disclosure; minimal cognitive load while still supporting depth.

- **WhatsApp**
  - Strength: messaging and contacts feel immediate and reliable.
  - UX takeaway: fast inbox triage, clear identity/context, low-friction reply, predictable notification semantics.

### Transferable UX Patterns

- **Navigation patterns**
  - Home as cockpit: a single primary surface that answers “what’s happening?” and “what should I do next?” (inventory + channel rows + next actions).
  - Progressive disclosure: start with essentials (status + next action), expand for details (channel specifics, troubleshooting, audit references).

- **Interaction patterns**
  - Photos-first capture with immediate visible progress (draft created immediately, then fill minimal fields).
  - Publish outcomes as durable, legible states (queued/succeeded/failed/action needed) per channel row.
  - Inbox patterned after messaging apps: conversation list → thread → quick reply; always preserve context (item + channel).

- **Visual patterns**
  - Etsy-like calmness: whitespace, clear hierarchy, restrained color; use color only to encode status and urgency.
  - WhatsApp-like clarity: obvious unread state, timestamps, and consistent message delivery semantics.

### Anti-Patterns to Avoid

- Too many clicks: avoid multi-screen funnels for common actions; reduce steps for create/publish/reply.
- Spammy notifications: avoid noisy triggers; prioritize meaningful events (publish outcome, new message, assisted reminder) with user control.
- Lack of onboarding: don’t drop users into an empty cockpit without guidance.
- No quick success: ensure a fast first win (first item created + posted + visible channel rows) with minimal setup.

### Design Inspiration Strategy

- **Adopt**
  - Messaging clarity (WhatsApp): predictable inbox patterns and reliable reply flow.
  - Calm, simple presentation (Etsy): reduce anxiety and increase trust through visual hierarchy and restraint.
  - Reach-as-value (eBay): make “posted everywhere” visible and satisfying.

- **Adapt**
  - Marketplace breadth framing (eBay) into “country packs + global anchor,” with capability-honest Connected vs Assisted.
  - Ecommerce polish (Etsy) into an operational cockpit without losing density (status + next action remain primary).

- **Avoid**
  - Click-heavy workflows that make common actions feel like a form marathon.
  - Notification overload that breaks the calm/empowered emotional goal.
  - Onboarding that delays the first success moment.

## Design System Foundation

### 1.1 Design System Choice

Use a **themeable design system**:
- **React Native**: **React Native Paper** as the primary component foundation.
- **Web app**: use a **Material-aligned component set** with shared tokens (colors/typography/spacing) to maintain parity and reduce cognitive switching across platforms.

### Rationale for Selection

- **Speed + quality** (solo-friendly): strong defaults, accessibility patterns, and broad component coverage.
- **Calm, trustworthy feel**: theming supports restrained color + clear hierarchy to reinforce “calm, empowered, success.”
- **Consistency across mobile + web**: a shared design language reduces re-learning and helps the cockpit feel like one product.

### Implementation Approach

- Define a small set of cross-platform **design tokens** (color, type scale, spacing, radius, elevation, status colors).
- Apply tokens via:
  - Paper theme (light/dark readiness even if dark isn’t shipped day-1).
  - Web theme layer that mirrors the same tokens.
- Prefer composition over custom components early; create custom components only when the cockpit patterns require it (e.g., “channel row,” “publish outcome state,” “assisted checklist”).

### Customization Strategy

- Start with a neutral, calm baseline (Etsy-inspired restraint) and encode meaning with **status colors** only (success/warn/error/action-needed).
- Make “next action” affordances consistent everywhere (inventory row, item detail, troubleshooting) to reduce clicks.
- Notification design follows “WhatsApp-like” predictability: few high-signal triggers, clear user controls, no spam.

## 2. Core User Experience

### 2.1 Defining Experience

**Create once → publish everywhere → see the cockpit instantly → reply from one place.**

The defining experience is that a seller creates a canonical item and, upon saving, the system **auto-starts publishing** across their available marketplaces. The user immediately lands in an inventory “cockpit” view where the item appears with **per-marketplace channel rows** showing status, links, and next actions. For buyer communication, the user can **triage and reply** from a unified inbox for Connected channels, and use guided link-out/resume flows for Assisted channels without losing context.

### 2.2 User Mental Model

Today, sellers typically:
- Post **one marketplace at a time** (re-entering the same content repeatedly).
- Manage **separate inboxes** per marketplace, which creates missed messages, duplicated effort, and anxiety about what’s happening where.

`sell-items` should match the seller’s mental model of “I’m selling an item” (not “I’m managing listings”), with marketplaces represented as channel rows under that item.

### 2.3 Success Criteria

1. **Immediate cockpit clarity after save**: after saving an item, the user instantly sees channel rows with clear states (publishing/posted/action needed/failed) and next actions.
2. **No ambiguous outcomes**: every publish attempt resolves into a durable outcome per channel, including Assisted “finish posting” as a first-class state.
3. **Reply without switching context**: the user can triage/reply in one inbox for Connected channels, and link out/resume Assisted conversations without losing item/conversation context.

### 2.4 Novel UX Patterns

The interaction uses mostly familiar patterns (forms, lists, inbox threads) but combines them in an opinionated way:
- **Channel rows under a canonical item** as the primary organizing model.
- **Auto-start publishing after save** with durable, per-channel outcomes.
- **Capability-honest inbox unification**: one cockpit experience without pretending Assisted can do what Connected does.

This should feel intuitive with light education: “An item is the unit; marketplaces are rows.”

### 2.5 Experience Mechanics

**1) Initiation**
- User starts via “New Item” (photos-first).
- They choose marketplaces (default: all in their pack unless opted out).

**2) Interaction**
- User saves the item (or completes minimum required fields), and the system auto-starts publishing for selected channels.
- Assisted channels produce a listing package + resumable steps; Connected channels publish in background.

**3) Feedback**
- The user sees channel rows immediately with durable statuses and next actions.
- Clear affordances for “finish assisted posting,” “retry,” “reconnect,” or “fix missing field.”

**4) Completion**
- Item reaches “Posted” (Connected) and “Posted/Confirmed” (Assisted completion).
- Inbox supports buyer response workflows; close-out guides delisting/checklists when sold.

## Visual Design Foundation

### Color System

**Direction:** calm-neutral foundation with a trust-forward blue primary. Color is used sparingly; status + urgency carry the meaning.

- **Primary (Brand / Actions):** Blue (links, primary buttons, key highlights)
- **Neutrals (Foundation):** soft gray scale for surfaces, borders, and typography contrast
- **Semantic Status Colors (used intentionally, not everywhere):**
  - Success: green (posted/complete)
  - Warning: amber (action needed / assisted step pending)
  - Error: red (failed / attention required)
  - Info: blue (publishing / syncing / neutral system states)

**Light + Dark themes**
- Light: high clarity, low visual noise, “calm cockpit”
- Dark: same semantics, reduced glare, preserve readability and contrast

**Color usage rules**
- Default UI stays neutral; **only status + primary actions** get strong color.
- Channel-row states must be visually distinct without relying on color alone (icon + label + text).

### Typography System

**Tone:** modern, friendly-professional, highly readable (minimize cognitive load).
- Emphasis on clear hierarchy (titles, section headers, labels, body).
- Prefer system-native typography for performance and familiarity unless brand fonts emerge later.

**Hierarchy guidance**
- Strong page titles for orientation (Inventory, Inbox, Item)
- Clear section headers (Marketplaces, Publish status, Close-out)
- Form labels and helper text optimized for scanning (avoid dense paragraphs)

### Spacing & Layout Foundation

**Direction:** airy enough to feel calm, but operationally efficient (“cockpit, not catalog”).
- Use an **8pt spacing system** (8/16/24/32…) for predictable rhythm.
- Maintain strong alignment and consistent paddings across mobile + web.
- Prefer single-primary-column layouts with progressive disclosure for details.

**Layout principles**
- “Next action first”: the most important action is always within easy reach and visually obvious.
- “Status is a first-class object”: channel rows are consistent, compact, and scan-friendly.
- “Fewer taps”: reduce funnel depth; avoid multi-screen confirmation chains.

### Accessibility Considerations

- Maintain contrast that supports WCAG AA where applicable (especially web).
- Don’t encode meaning by color alone: pair color with icons, text labels, and shape.
- Ensure touch targets and spacing are comfortable on mobile.
- Typography supports readability (line height, size, and clear label/error messaging).

## Design Direction Decision

### Design Directions Explored

- Direction 1 — Calm Airy Cards: minimal noise, clear card-based channel rows with strong status chips.
- Direction 2 — KPI Cockpit: adds a small, calm KPI card that reinforces progress and reduces anxiety (“what’s done / what needs action”).

### Chosen Direction

**Chosen direction:** Direction 1 as the base, with Direction 2’s KPI card added to the Inventory cockpit.

**Key elements to carry forward**

- Airy, calm layout with generous spacing (supports calm + trust).
- Card-like item rows with per-marketplace status chips and progress indicators.
- Bottom tab navigation for quick access to Inventory + Inbox + New Item.
- A small KPI card (e.g., “channels posted”, “needs action”) at the top of Inventory to make success visible at a glance.

### Design Rationale

- Supports the emotional goals: **calm** (low noise), **empowered** (next actions are explicit), **success** (KPI card makes progress tangible).
- Improves cockpit scanability: users can instantly answer “what happened?” and “what’s next?” without opening each item.
- Aligns with the defining experience: “create once → publish everywhere → see channel rows instantly → reply from one place.”

### Implementation Approach

- Implement Inventory with a reusable “cockpit header” slot that can render the KPI card.
- Implement a reusable “item card” pattern with consistent channel-row chips + progress.
- Keep KPI content minimal and high-signal (no dashboards); avoid turning the cockpit into analytics.
- Ensure KPI + chips remain accessible (not color-only; include labels/icons).

## User Journey Flows

### Journey 1 — Declutter Sprint (Create → Auto-Publish → Reply → Close-out)

**Goal:** Post an item to Marktplaats (Connected) + Facebook (Assisted), then manage messages and mark sold without losing track.

```mermaid
flowchart TD
  A[Inventory cockpit] --> B[New Item (photos-first)]
  B --> C[Enter minimal fields + Save]
  C --> D[Auto-start publishing for selected channels]
  D --> E[Item appears with channel rows + statuses]
  E --> F{Marktplaats publish result}
  F -->|Posted| G[Marktplaats row: Posted + link]
  F -->|Failed| H[Marktplaats row: Failed → fix field / retry / reconnect]
  E --> I{Facebook assisted status}
  I -->|Needs steps| J[Facebook row: Finish posting (Assisted checklist)]
  J --> K[Open Facebook via deep link + listing package]
  K --> L[Return to sell-items]
  L --> M{Confirm posted}
  M -->|Manual confirm| N[Facebook row: Posted (confirmed)]
  M -->|Paste URL| O[Store URL + mark Posted (confirmed)]
  G --> P[Inbox: new message arrives (Connected)]
  P --> Q[Open thread with item context]
  Q --> R[Reply in-app → delivery state shown]
  R --> S[Schedule pickup / set Pending (optional)]
  S --> T[Mark Sold]
  T --> U[Close-out checklist per channel]
  U --> V[Connected: attempt automated end listing]
  U --> W[Assisted: deep link + guided steps to end listing]
  V --> X[Item state: Sold + completion shown]
  W --> X
```

**Primary UI feedback**
- Inventory shows a KPI card (“posted channels”, “needs action”) + the item card with status chips.
- Each channel row resolves to durable states: publishing/posted/action needed/failed, with a single next action.

**Error recovery**
- “Fix missing field” takes the user directly to the relevant field.
- “Retry” is always visible for recoverable failures; “Reconnect” when auth expired.

---

### Journey 2 — Assisted Posting Completion (Finish Facebook → Confirm)

**Goal:** Make Assisted posting feel first-class and low friction while remaining capability-honest.

```mermaid
flowchart TD
  A[Item card: Facebook = Finish posting] --> B[Open assisted checklist]
  B --> C[View listing package: title/description/price/photos]
  C --> D[Deep link to Facebook flow]
  D --> E[User completes posting in Facebook]
  E --> F[Return to sell-items (auto-resume state)]
  F --> G{Confirmation method}
  G -->|Manual confirm| H[Mark Posted (confirmed)]
  G -->|Paste listing URL| I[Validate/store URL + mark Posted (confirmed)]
  H --> J[Facebook row shows Posted + optional link placeholder]
  I --> K[Facebook row shows Posted + link]
```

**UX safeguards**
- Confirmation options are presented as: **Confirm posted** (fast) and **Add listing link (optional)** (better tracking).
- If the user doesn’t confirm, the cockpit keeps Facebook in “Finish posting” with a gentle reminder (no spam).

---

### Journey 3 — Garage Sale / Sell-a-Lot (Bulk Capture → Batch Auto-Publish)

**Goal:** List 10–30 items quickly, avoid losing track, and keep next actions obvious.

```mermaid
flowchart TD
  A[Inventory cockpit] --> B[Bulk mode: capture photos quickly]
  B --> C[Create multiple drafts with minimal fields]
  C --> D[Review queue: missing fields + channel selection]
  D --> E[Save → auto-start publishing in background]
  E --> F[Inventory shows KPI: posted / needs action / pending]
  F --> G[Batch “action needed” triage]
  G --> H[Fix missing fields (inline) OR open item]
  G --> I[Resume assisted posting for selected items]
  F --> J[Inbox triage for Connected channels]
  J --> K[Reply with templates/snippets]
  K --> L[Mark items Pending/Sold]
  L --> M[Close-out checklist per channel]
```

**Flow optimization principles**
- “Next action first” and “batch-friendly” operations for bulk sessions.
- Always preserve calm: avoid modal-heavy confirmations; use durable state + clear next steps.

### Journey Patterns

- **Cockpit-first navigation**: Inventory is home; everything returns to item + channel rows.
- **Durable status language**: publishing/posted/action needed/failed across all flows.
- **Assisted stays first-class**: checklist + resume + confirm (manual or URL).
- **Few-click rule**: the most common next action is always 1 tap away from the cockpit.

### Flow Optimization Principles

- Optimize for “first win” (first item posted + visible channel rows) before teaching advanced features.
- Keep error recovery specific and direct (“fix field X”) rather than generic “something went wrong.”
- Limit notifications to high-signal events and provide clear user controls.

## Component Strategy

### Design System Components

**Foundation (React Native Paper)**  
Use Paper components as the base building blocks for speed and consistency:

- App shell: AppBar, BottomNavigation, Surface, Card
- Inputs: TextInput, Button, IconButton, SegmentedButtons/Chips
- Feedback: Snackbar, Dialog, ProgressBar/ActivityIndicator, List
- Layout primitives: Divider, Badge, Avatar/Icon, Menu

### Custom Components

### CockpitKpiCard

**Purpose:** Make success and urgency visible at-a-glance on the Inventory cockpit.  
**Usage:** Top-of-Inventory “cockpit header” slot.  
**Content:** Two primary metrics:
- **Posted channels** (e.g., “2 posted”)
- **Needs action** (e.g., “1 needs action”)  
**Actions:** Tap a metric to filter inventory (posted-only / action-needed).  
**States:** loading, normal, empty (0/0), error (rare; fallback to “—”).  
**Variants:** compact (mobile), expanded (web).  
**Accessibility:** metrics are labeled buttons; not color-only.  
**Interaction Behavior:** updates live as publish states change; stays calm (no animations that feel noisy).

### ItemCockpitCard

**Purpose:** The canonical item representation in the cockpit (“one item → many channels”).  
**Usage:** Inventory list; optionally reused on Item detail as a summary header.  
**Anatomy:** photo thumbnail, title, price, logistics (pickup/shipping), overall status, next action, channel-row chips.  
**Actions:** open item, quick “next action,” quick “view messages” (if available).  
**States:** draft, publishing, posted, action needed, failed, sold, pending pickup.  
**Accessibility:** structured headings and clear tap targets; supports screen readers.

### ChannelStatusChip (icon + text)

**Purpose:** Make Connected vs Assisted + per-channel state obvious and scannable.  
**Usage:** Within ItemCockpitCard and Item detail “Marketplaces” section.  
**Content:** marketplace icon + name + state label (e.g., “Marktplaats · Posted”).  
**States:** publishing, posted, action needed, failed, not started, confirmed.  
**Variants:** compact (list), full (detail).  
**Accessibility:** includes text label; icon is decorative unless needed for identification.

### PublishProgressBar

**Purpose:** Provide confidence during auto-start publishing without ambiguity.  
**Usage:** Within ItemCockpitCard and Item detail status section.  
**Behavior:** shows publishing progress (or discrete steps) and transitions to final outcomes.  
**States:** indeterminate (unknown progress), determinate (when possible), hidden when stable (posted/sold).

### NextActionBanner (single next action)

**Purpose:** Reduce clicks: always surface the most important next action for the item.  
**Usage:** inside ItemCockpitCard; also in troubleshooting and assisted checklist.  
**States:** none (no action), normal, warning, error.  
**Accessibility:** button label describes the action (“Finish Facebook posting”, “Fix category”, “Retry publish”).

### AssistedChecklistCard (Facebook Assisted)

**Purpose:** Make Assisted feel first-class with resumable steps and explicit confirmation.  
**Usage:** Item detail; can be deep-linked from Inventory “Finish posting” next action.  
**Anatomy:** step list, “Open Facebook” deep link, listing package access, **Paste listing URL (required)**, “Confirm posted”.  
**Key rule:** User must paste the listing URL to mark Assisted as “Posted (confirmed)”.  
**States:** not started, in progress, awaiting URL, confirmed posted, error (invalid URL format).  
**Accessibility:** step list is readable; required field clearly labeled.

### TroubleshootingPanel

**Purpose:** Calm recovery: convert failures into clear next steps and preserve trust.  
**Usage:** Item detail and publish failure states; accessible from channel chip or next-action.  
**Content:** human-readable error, recommended fix, retry/reconnect actions, trace/reference ID.  
**States:** show latest failure, show history link (optional later).

### ConversationListItem + ReplyComposer

**Purpose:** WhatsApp-like triage and fast reply without losing item context.  
**Usage:** Inbox list and thread screens.  
**Features:** item context header, delivery state badges, templates/snippets entry points.  
**States:** unread, read, sending, sent, failed, last synced indicator.

### Component Implementation Strategy

- Build all custom components using Paper tokens/theme; avoid one-off styling.
- Standardize the “durable state language” across components: publishing/posted/action needed/failed.
- Make the cockpit scan-first: chips + next action + KPI always visible, no hidden states.
- Ensure all critical meaning is encoded in **text + icon + structure**, not color alone.

### Implementation Roadmap

**Phase 1 — MVP-critical**
- CockpitKpiCard
- ItemCockpitCard
- ChannelStatusChip
- NextActionBanner
- AssistedChecklistCard (with URL required)
- TroubleshootingPanel

**Phase 2 — Selling loop completion**
- ConversationListItem + ReplyComposer
- Delivery state indicators and templates/snippets entry points
- Close-out checklist component(s)

**Phase 3 — Growth**
- Bulk/Garage-sale mode components (bulk capture queue, batch action-needed triage)
- Risky-category review components (request review, status, reviewer decision)

## UX Consistency Patterns

### Button Hierarchy

- **Primary**: the single best “next action” for the user’s goal (one per surface/card).
- **Secondary**: supporting actions (view details, change marketplaces, etc.).
- **Destructive**: clearly separated (archive, delete, disconnect).

**Rule:** For “action needed” and most failures, the primary CTA is **Fix now** (deep-links to the exact field/step).

### Feedback Patterns

**Durable status language (everywhere):**

- Publishing
- Posted
- Action needed
- Failed
- Not started
- Confirmed (Assisted, after URL)

**Where statuses appear**

- Inventory item card (overall)
- Channel chips (per marketplace)
- Item detail status section
- Troubleshooting panel
- Inbox (last synced, delivery state)

**Delivery states (messaging)**

- Sending / Sent / Failed (with retry + link-out fallback if needed)

### Form Patterns

- **Photos-first**: photos are the default first step; text fields follow.
- **Minimum required fields**: show only what’s required to publish; advanced fields via progressive disclosure.
- **Inline validation**: errors appear at the exact field, with one-tap jump from “Fix now.”
- **Save-first mentality**: saving creates a durable draft; publishing can proceed asynchronously.

### Navigation Patterns

- **Bottom tabs**: Inventory (home), Inbox, New Item, Ops/Settings.
- **Return-to-cockpit**: after any sub-flow (assisted posting, troubleshooting, close-out), return to the item card context.
- **Deep links preserve context**: link-outs open with “return to sell-items” affordance and resume state.

### Modal & Overlay Patterns

- Use modals sparingly; prefer inline panels and bottom sheets for quick actions.
- Confirmations only for destructive actions; avoid confirmation chains that add clicks.

### Empty, Loading, and Error States

- Empty Inventory: guided “first win” prompt (create item → auto-publish).
- Loading: show “publishing” states with clear next step; avoid spinners without meaning.
- Errors: show a calm explanation + **Fix now** + secondary troubleshooting.

### Search & Filtering Patterns

- Inventory filters: Action needed, Publishing, Posted, Sold, Marketplace.
- Inbox filters: Unread, Needs reply, Marketplace, Item.

### Additional Patterns

**Assisted posting confirmation**

- Posting is confirmed only after **pasting listing URL** (required).
- Manual “posted” without URL is not sufficient for “confirmed” state (keeps cockpit honest).

**Notification patterns**

- High-signal only: publish outcomes, new Connected message, assisted reminder.
- No spam: reminders are gentle and user-controllable.

## Responsive Design & Accessibility

### Responsive Strategy

**Mobile (primary for capture + publish)**
- Bottom tabs remain the primary navigation.
- Inventory is a single-column cockpit with KPI card + item cards optimized for scanning.
- Item detail uses progressive disclosure (collapse/expand) to avoid long scroll walls.
- Assisted posting and troubleshooting use focused flows (panels/bottom sheets) to reduce cognitive load.

**Tablet**
- Keep touch-first UI.
- Use 1–2 columns where it improves scanning (e.g., Inventory list with a detail preview when space allows), but avoid “desktop complexity.”
- Maintain large touch targets and predictable bottom navigation.

**Desktop (web) — two-pane**
- Two-pane layout for efficiency and “calm cockpit” oversight:
  - Left pane: Inventory list (KPI card + item cards)
  - Right pane: Item detail / Assisted checklist / Troubleshooting / Inbox thread
- This reduces page hopping and supports “reply without losing context.”

### Breakpoint Strategy

Use standard breakpoints:
- **Mobile:** 320–767
- **Tablet:** 768–1023
- **Desktop:** 1024+

Layout adaptations:
- Desktop: enable two-pane by default at ≥1024px
- Tablet: conditionally enable two-pane only when comfortable (landscape + sufficient width)
- Mobile: always single-pane

### Accessibility Strategy

**Target:** **WCAG 2.1 AA** (web baseline; mobile follows equivalent best practices).

Key requirements:
- Contrast-compliant text and critical UI elements.
- Keyboard navigation on web for all primary flows (Inventory, New Item, Inbox, Troubleshooting).
- Screen reader support with clear labels and semantic structure.
- Touch targets ≥ 44×44px.
- Focus indicators and focus management for dialogs/sheets.
- Meaning not encoded by color alone (status chips include icon + text).

### Testing Strategy

**Responsive testing**
- Real-device testing on iOS + Android for photo capture, publish flow, and inbox.
- Browser testing: Chrome/Edge/Firefox/Safari for web.
- Validate two-pane behavior (resize, deep links, back navigation, focus).

**Accessibility testing**
- Automated checks on web (axe/lighthouse) as a baseline.
- Screen readers: VoiceOver (macOS/iOS) + NVDA (Windows).
- Keyboard-only flows on web (tab order, focus traps, skip-like behaviors where needed).
- Color blindness simulation for status colors and chips.

### Implementation Guidelines

**Responsive**
- Mobile-first layouts; scale up to tablet/desktop.
- Two-pane desktop uses persistent selection state (selected item/conversation) rather than route-only navigation.
- Ensure “return to cockpit” is always clear (breadcrumb/back).

**Accessibility**
- Use semantic structure on web; label all inputs and icon buttons.
- Announce state changes where needed (publish result, message send failed, sync freshness).
- Provide descriptive errors with “Fix now” deep-links to the exact field/step.
