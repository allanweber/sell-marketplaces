# BMAD command sequence (ongoing projects)

This is the **simple, end-to-end sequence flow** of the `bmad-*` workflows to run for an ongoing project. It’s organized by phase and includes the repeating “story loop” you’ll run during development.

## Outputs (where you’ll see results)

- Planning outputs: `_bmad-output/planning-artifacts/`
- Implementation outputs: `_bmad-output/implementation-artifacts/` (includes `sprint-status.yaml`)

## Phase 0 — (optional) brownfield / catch-up

If you’re joining an existing codebase or your docs are stale:

```bash
bmad-document-project
bmad-generate-project-context
```

## Phase 1 — discovery / research (optional)

Run only if you need research inputs before writing/adjusting requirements:

```bash
bmad-domain-research
bmad-market-research
bmad-technical-research
```

## Phase 2 — planning (requirements + UX)

Create or update the PRD/UX, then validate.

```bash
bmad-create-prd
bmad-validate-prd [path-to-prd.md]
bmad-create-ux-design
```

If you need to revise the PRD based on validation feedback:

```bash
bmad-edit-prd [path-to-prd.md]
```

## Phase 3 — solutioning (architecture + epics/stories)

```bash
bmad-create-architecture
bmad-create-epics-and-stories
bmad-check-implementation-readiness
```

## Phase 4 — kick off implementation (creates tracking)

This generates/updates your sprint tracking (for this repo it’s `sprint-status.yaml`).

```bash
bmad-sprint-planning
```

After kickoff (and throughout development), you can run a quick “where are we / what’s next” summary at any time:

```bash
bmad-sprint-status
```

## Phase 5 — the story loop (repeat until you ship)

Run this loop for each story you want to implement.

### 5.1 Create the next story

```bash
bmad-create-story create
```

### 5.2 Validate story readiness (definition of ready)

```bash
bmad-create-story validate
```

### 5.3 Implement the story

```bash
bmad-dev-story
```

### 5.4 Code review gate

```bash
bmad-code-review
```

### 5.5 (Optional) generate automated tests

```bash
bmad-qa-generate-e2e-tests
```

### 5.6 Check overall sprint status anytime

```bash
bmad-sprint-status
```

## Phase 6 — end of epic (optional but recommended)

```bash
bmad-retrospective
```

### Phase 5–6 flow (diagram)

```mermaid
flowchart TD
  A["5.1 Create story<br/>bmad-create-story create"] --> B["5.2 Validate story<br/>bmad-create-story validate"]
  B --> C["5.3 Dev story<br/>bmad-dev-story"]
  C --> D["5.4 Code review<br/>bmad-code-review"]
  D -->|changes requested| C
  D -->|approved| E["(optional) 5.5 QA automation<br/>bmad-qa-generate-e2e-tests"]
  E --> F["Repeat Phase 5 for next story"]
  D --> F
  F -->|epic complete| G["Phase 6 Retrospective<br/>bmad-retrospective"]
```

## Phase 7 — when things change (anytime)

If scope/assumptions shift significantly mid-sprint:

```bash
bmad-correct-course
```

