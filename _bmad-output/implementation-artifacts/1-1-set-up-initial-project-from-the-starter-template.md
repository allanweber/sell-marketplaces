# Story 1.1: Set up initial project from the starter template

Status: ready-for-dev

## Story

As a developer,  
I want to initialize the monorepo from the selected starter template,  
so that we have a working baseline for web, mobile, and shared packages.

## Acceptance Criteria

1. **Given** the architecture specifies `npx create-turbo@latest -e with-react-native-web`  
   **When** the project is initialized  
   **Then** the repo contains working `apps/web` and `apps/native` projects (and workspace tooling)  
   **And** the default dev commands run successfully for web and native

2. **Given** a developer follows the README/setup steps  
   **When** they install dependencies and run the dev servers  
   **Then** the app starts without errors using the documented steps

## Tasks / Subtasks

- [ ] Initialize monorepo using the selected starter (AC: 1)
  - [ ] Run `npx create-turbo@latest -e with-react-native-web` in repo root
  - [ ] If the repo is currently empty/non-git, initialize git (`git init`) after scaffold so future stories can use commit history
  - [ ] Confirm the scaffold includes `apps/web` (Next.js) and `apps/native` (Expo)
  - [ ] Commit to a single package manager and lockfile (prefer what the starter generates; keep consistent repo-wide). If the starter generates `pnpm-lock.yaml`, use `pnpm` repo-wide.

- [ ] Ensure local dev boot works for web and native (AC: 1, 2)
  - [ ] Document prerequisites in `README.md` (Node version policy, package manager, platform prerequisites for Expo)
  - [ ] Confirm web dev server runs and renders the starter screen
  - [ ] Confirm native dev server runs (at minimum: Expo dev server starts and app loads in an emulator/device **or** a web preview; choose whichever is available on the dev machine)
  - [ ] Capture the exact commands in the README so another dev can reproduce the “it runs” result

- [ ] Apply the architecture’s monorepo structure guardrails early (AC: 1)
  - [ ] Add **empty scaffolding** (folders + minimal package manifests) for:
    - [ ] `apps/worker` (BullMQ worker process)
    - [ ] `packages/domain` (shared domain types + Zod schemas)
    - [ ] `packages/db` (Drizzle schema + migrations)
    - [ ] `packages/connectors` (marketplace adapters)
  - [ ] Ensure workspace config includes the new packages/apps so they typecheck/build (even if they do “nothing” yet)

## Dev Notes

- **Starter command (required)**: `npx create-turbo@latest -e with-react-native-web`.  
  Source: `_bmad-output/planning-artifacts/architecture.md#Selected Starter: Turborepo & React Native (Next.js + Expo)` and `#Starter Template Evaluation` (see “Initialization Command”).

- **Expected monorepo shape** (this story should not fight the architecture):  
  - `apps/web`: Next.js app (UI + REST API later)  
  - `apps/native`: Expo app  
  - `apps/worker`: BullMQ workers (Node runtime)  
  - `packages/domain`, `packages/connectors`, `packages/db`, `packages/ui`  
  Source: `_bmad-output/planning-artifacts/architecture.md#Structure Patterns` and `#Project Structure & Boundaries`.

- **Scope boundary**: this story is about **scaffolding + “it runs”**. Do **not** start implementing auth, DB, queues, or UI features beyond what’s required to keep the repo healthy and aligned with the planned structure.

### Definition of Done (unambiguous checks)

- **Repo has**: `apps/web/` and `apps/native/` directories created by the starter.
- **Install works** using the repo’s chosen package manager and lockfile (whatever the starter created).
- **Web dev boots** via the repo’s documented command (e.g., `pnpm dev` or `pnpm --filter web dev` depending on starter scripts) and serves a page without runtime errors.
- **Native dev boots** via the repo’s documented command (e.g., `pnpm dev --filter native` or the starter’s equivalent) and loads the starter app in at least one target (device/emulator or web preview).
- **README.md includes**: prerequisites + exact install + exact run commands for both `apps/web` and `apps/native`.

### Project Structure Notes

- If the starter outputs a slightly different default layout, keep the starter working first, then align toward the documented structure with **minimal churn** (avoid large refactors in this enabling story).

### References

- `_bmad-output/planning-artifacts/epics.md` → `Epic 1 / Story 1.1`
- `_bmad-output/planning-artifacts/architecture.md` → `Starter Template Evaluation`, `Structure Patterns`, `Project Structure & Boundaries`, `First Implementation Priority`

## Dev Agent Record

### Agent Model Used

GPT-5.2

### Debug Log References

- (none)

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created

### File List

- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-the-starter-template.md`
