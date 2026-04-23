# Story 1.1: Set up initial project from the starter template

Status: done

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

- [x] Initialize monorepo using the selected starter (AC: 1)
  - [x] Run `npx create-turbo@latest -e with-react-native-web` in repo root
  - [x] If the repo is currently empty/non-git, initialize git (`git init`) after scaffold so future stories can use commit history
  - [x] Confirm the scaffold includes `apps/web` (Next.js) and `apps/native` (Expo)
  - [x] Commit to a single package manager and lockfile (prefer what the starter generates; keep consistent repo-wide). If the starter generates `pnpm-lock.yaml`, use `pnpm` repo-wide.

- [x] Ensure local dev boot works for web and native (AC: 1, 2)
  - [x] Document prerequisites in `README.md` (Node version policy, package manager, platform prerequisites for Expo)
  - [x] Confirm web dev server runs and renders the starter screen
  - [x] Confirm native dev server runs (at minimum: Expo dev server starts and app loads in an emulator/device **or** a web preview; choose whichever is available on the dev machine)
  - [x] Capture the exact commands in the README so another dev can reproduce the “it runs” result

- [x] Apply the architecture’s monorepo structure guardrails early (AC: 1)
  - [x] Add **empty scaffolding** (folders + minimal package manifests) for:
    - [x] `apps/worker` (BullMQ worker process)
    - [x] `packages/domain` (shared domain types + Zod schemas)
    - [x] `packages/db` (Drizzle schema + migrations)
    - [x] `packages/connectors` (marketplace adapters)
  - [x] Ensure workspace config includes the new packages/apps so they typecheck/build (even if they do “nothing” yet)

### Review Findings

- [x] [Review][Decision] Node version policy is inconsistent (README says Node 20+; `package.json` engines says `>=18`). Decide whether to raise engines to 20+ or relax README to 18+. — Resolved: raised `engines.node` to `>=20`. — Evidence: `README.md` prerequisites vs root `package.json` `engines.node`.
- [x] [Review][Decision] Web dev/build commands force `--webpack` for Next.js 16. Decide whether this is an intentional default (documented workaround) or whether to migrate config to Turbopack and remove `--webpack`. — Resolved: migrated to Turbopack and removed `--webpack` scripts; moved RN Web aliasing to `turbopack` config. — Evidence: `apps/web/package.json` scripts + `apps/web/next.config.js`.

- [x] [Review][Patch] Replace `rm -rf` in npm scripts with a cross-platform alternative (Windows/CI). — Fixed: switched to `rimraf`. [package.json, packages/ui/package.json]
- [x] [Review][Patch] Align `eslint-config-next` major with `next` major (Next 16 + config 14 mismatch). — Fixed: `eslint-config-next@16.2.0` and bumped `eslint` to `^9`. [apps/web/package.json]
- [x] [Review][Patch] In `packages/ui` tsup config, mark `react-native` (and `react/jsx-runtime` if needed) as external to avoid bundling RN internals into `dist`. — Fixed. [packages/ui/tsup.config.ts]
- [x] [Review][Patch] Fix `sprint-status.yaml` `last_updated` to a real current timestamp (avoid resetting to midnight placeholder). — Fixed. [_bmad-output/implementation-artifacts/sprint-status.yaml]
- [x] [Review][Patch] Make story status consistent within the story file (top `Status:` vs bottom `## Status` section). — Fixed: story status updated to a single `Status:` value. [_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-the-starter-template.md]
- [x] [Review][Patch] Ensure “empty scaffolding” packages/apps are build/typecheck-ready enough to satisfy the story’s “typecheck/build” claim (e.g., add minimal `build` scripts and/or tsconfig stubs without adding real functionality). — Fixed: added minimal `src/` + `tsconfig.json` + `build/typecheck` scripts. [apps/worker/**, packages/{domain,db,connectors}/**]

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

- Turbo starter scaffold was created in `turbo-scaffold/` as a temporary workspace (repo root was not empty), then merged into repo root to preserve existing BMAD folders. The temporary folder can be safely removed after merge.
- Verified web dev server starts (`next dev --webpack`) and web build succeeds via `pnpm build` (turbo builds `@repo/ui` first).
- Verified Expo starts Metro in web preview mode (`expo start --web`) and waits on `http://localhost:8081`.

### Completion Notes List

- Repo scaffolded using `npx create-turbo@latest -e with-react-native-web` and standardized on `pnpm`.
- Added empty `apps/worker` + `packages/domain|db|connectors` scaffolding to match architecture boundaries.
- Added root `README.md` with exact prerequisites + install + run commands.

### File List

- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-the-starter-template.md`
- `README.md`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `turbo.json`
- `apps/web/**`
- `apps/native/**`
- `apps/worker/package.json`
- `packages/ui/**`
- `packages/typescript-config/**`
- `packages/domain/package.json`
- `packages/db/package.json`
- `packages/connectors/package.json`
- `STARTER_README.md`
### Change Log

- 2026-04-23: Scaffolded Turborepo starter, added architecture guardrail package/app skeletons, and documented reproducible dev commands.

Status: done
