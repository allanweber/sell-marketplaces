---
title: "Product Brief: sell-items"
status: "final"
created: "2026-04-22T00:00:00Z"
updated: "2026-04-22T00:00:00Z"
inputs:
  - "_bmad-output/planning-artifacts/research/market-sell-items-crosslisting-research-2026-04-22.md"
  - "_bmad-output/planning-artifacts/research/technical-marketplace-integrations-nl-br-research-2026-04-22-174138.md"
  - "_bmad-output/brainstorming/brainstorming-session-2026-04-22-142534.md"
---

## Executive Summary

Selling used items should be simple: take a few photos, write a description, and reach nearby buyers. In practice, casual sellers and small “side-hustle” resellers lose hours recreating the same listing across apps, juggling multiple inboxes, and dealing with no-shows and scams—often enough friction to give up and donate or throw items away.

`sell-items` is a consumer-first **selling cockpit** for the Netherlands (NL) that helps sellers **sell faster** by turning one “canonical” listing into multiple marketplace listings and keeping the selling workflow organized end-to-end. The MVP starts with **Marktplaats + Facebook Marketplace (assisted posting)**, then expands via “country packs” (e.g., Brazil with OLX + Mercado Livre) as integrations and localization mature.

The wedge is not “risky automation.” It’s **reliable, policy-safe workflow acceleration**: make listing creation fast and high-quality, reduce duplicated effort, help sellers stay on top of conversations, and close out listings everywhere to prevent double-selling where the platform allows it.

## The Problem

For typical consumer sellers—moving house, decluttering, or selling a handful of higher-value items—today’s process is inefficient and unpleasant:

- Re-enter the same details (title, description, price, condition, category, dimensions) per marketplace, each with different forms and rules.
- Re-upload photos repeatedly; manually re-order/crop; deal with upload failures.
- Lose track of what is posted where; forget to update or remove listings after an item sells.
- Manage fragmented messaging across apps; miss replies; repeat answers; negotiate differently per platform.
- Navigate real safety risks: scam attempts, fake payments, and coordination/no-show failure—especially painful in local pickup scenarios.

The cost is measurable: hours of duplicated work per selling “burst,” delayed sales, and a high drop-off rate where sellers stop listing altogether.

## The Solution

`sell-items` provides a single place to create and manage a listing, then distribute and run the sale across marketplaces.

### NL MVP channel feasibility (reality check)

Marketplace rules and APIs are uneven. For the NL MVP, **Marktplaats automated publishing is a hard requirement**; Facebook Marketplace is supported via assisted posting.

| Channel | Create listing | Edit listing | Close out / delist | Messaging (inbox) | How it works in MVP |
|---|---|---|---|---|---|
| Marktplaats (NL) | Automated (required) | Target: limited | Target: automated where feasible | Inbox: send replies (required) | Build around the safest feasible integration path; do not ship NL MVP without automated publish. |
| Facebook Marketplace (NL) | Assisted | Assisted | Assisted | Inbox: send replies (goal; can degrade) | Share kit + deep links; optional user-triggered extension-assisted form fill. |

### MVP experience (NL)

1. **Create once**: Seller creates a canonical listing with photos, condition, pickup/shipping preferences, and a suggested price range.
2. **Publish to channels**:
   - **Marktplaats**: automated publishing is required for NL MVP.
   - **Facebook Marketplace**: publish via a **policy-safe assisted flow** (share kit + optional extension-assisted form fill), keeping the user in control.
3. **Unified inbox (v1)**: sellers can **send replies** from `sell-items` (not just read).
   - Aggregate conversations where feasible and support replying in-app
   - Include reply templates, reminders, and “next best action” prompts (e.g., schedule pickup, confirm payment method)
   - Degrade gracefully per channel if needed, but the intent is “reply from one place”
4. **Track & close out**: show per-channel URLs/status; when an item sells, guide the seller to close it out everywhere (automated where allowed, assisted where not).

The product is designed to succeed even when a marketplace cannot be fully automated—by making assisted posting and workflow management feel “one-click,” not “two apps and a prayer.”

## What Makes This Different

- **Local-first channel strategy**: “country packs” focused on the marketplaces that actually matter in NL (Marktplaats + Facebook) before expanding; avoids the common US-centric crosslisting bias.
- **Policy-safe by design**: uses official APIs where available and **human-in-the-loop assisted posting** where access is restricted, lowering account suspension risk and building trust.
- **Reliability > breadth**: emphasizes stable status tracking, delist/mark-sold hygiene, and auditability to reduce the #1 crosslisting failure mode: double-selling due to broken sync.
- **Consumer-first UX**: optimized for “I’m moving this weekend” and “I’m decluttering tonight,” not for full-time reseller operations software.

## Competitors & Substitutes

- **Crosslisting tools (mostly US-centric)**: can be brittle, often weak on NL channels, and commonly fail on “close-out hygiene” (double-selling risk).
- **Marketplace-native workflows**: fine for single-channel sellers, but don’t reduce duplication across channels or unify the workflow.
- **DIY templates (copy/paste notes)**: free, but still high-friction and error-prone; no status tracking, no close-out discipline.

## Who This Serves

- **Primary (NL MVP)**: moving/decluttering sellers who want to sell items quickly without turning it into a part-time job.
  - Success looks like: list 5–20 items in one sitting, sell most within days, and feel safe + in control.
- **Secondary**: casual sellers of higher-value items (electronics, bikes, furniture) where reach and trust matter.
- **Later expansion (BR country pack)**: side-income micro-resellers who list frequently and benefit from reach + workflow discipline across OLX/Mercado Livre/Facebook.

## Success Criteria

**User outcomes**
- Reduce time-to-cross-post: median time from “create listing” → “listed on 2 channels” under a defined target (e.g., <10 minutes for a typical item).
- Increase sell-through / speed: improved time-to-first-contact and time-to-sale versus single-channel baseline.
- Reduce bad outcomes: lower rate of scam interactions, no-shows, and double-selling incidents (where measurable).

**Business outcomes**
- Activation: % of signups that publish at least one item to 2 channels within 24 hours.
- Retention: sellers who return to list again within 30 days (especially around moving/declutter bursts).
- Monetization: conversion to paid packs; repeat purchase rate; support cost per active seller kept low.

## Scope

### In scope (MVP)

- Canonical listing creation (photos + key attributes)
- NL channel pack: Marktplaats + assisted Facebook Marketplace
- Unified inbox (initially narrow but real; enough to reduce switching and missed replies)
- Per-channel listing links/status tracking
- “Mark sold / close out” workflow (automated where possible, assisted otherwise)
- Paid “packs” for cross-posting volume and/or premium workflow features

### Packaging hypothesis (packs)

- **Free**: cross-post up to **3** items (to prove value quickly).
- **Paid**: **€5** unlock after the free limit (initial test), with the paywall triggered after the user lists **3** items.

### Explicitly out of scope (MVP)

- Full automation for channels without official access (no brittle botting/scraping as the core)
- Two-way price/attribute sync across all channels (defer until reliability is proven)
- Full payments, shipping labels, or dispute mediation as first-class features (integrate/guide instead)

## Go-to-Market (NL)

Start where urgency is high and the pain is obvious:

- Moving/declutter communities and Facebook groups (including relocation/expat groups)
- SEO around “sell faster,” “list on Marktplaats and Facebook,” and “moving sale checklist”
- Early beta positioning: “List once. Reach more buyers. Stay organized. Sell safely.”

## Risks & Mitigations

- **Marketplace policy/enforcement risk (high)**: design around official APIs and explicit user actions; rate-limit; keep assisted flows compliant.
- **Integration availability gap**: build “graceful degradation” so assisted posting still delivers value; avoid over-promising automation.
- **Unified inbox complexity**: start with the minimum that reduces user switching; expand as technical feasibility is proven.
- **Support burden from flaky flows**: prioritize observability, clear status, and an audit trail for publish attempts early.
- **Mobile-first adoption risk (high)**: ship a mobile-first experience, while also providing a web app for larger-screen workflows. Treat desktop/extension as optional acceleration, not a requirement.

## Vision (2–3 years)

If `sell-items` succeeds in NL and proves the workflow and trust model, it becomes the default “selling cockpit” for consumers across multiple countries:

- More country packs (BR and beyond), localized templates, category intelligence, and safety guidance.
- Better listing quality engine (photo cleanup, attribute mapping, pricing/margin-aware guidance).
- Strong close-out everywhere: preventing double-sell and reducing seller stress through reliable status and deactivation workflows.
- A reputation/trust layer for safer transactions (without becoming a marketplace itself).
