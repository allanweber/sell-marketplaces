# sell-items

Monorepo scaffolded from Turborepo’s `with-react-native-web` example (Next.js + Expo), plus early empty package/app scaffolding to match the planned architecture.

## Prerequisites

- **Node.js**: use a current Node 20+ LTS
- **Package manager**: **pnpm** (this repo uses `pnpm-lock.yaml`)
- **Expo (native app)**:
  - For quickest local verification, we run Expo in **web preview** mode.
  - Optional (for devices/emulators): install the Expo Go app and/or Android Studio / Xcode.

## Setup

```bash
pnpm install
```

## Run (developer)

- **Run everything (Turborepo)**

```bash
pnpm dev
```

- **Web app (Next.js)**

```bash
pnpm --filter web dev
```

Then open `http://localhost:3000`.

- **Native app (Expo, web preview)**

```bash
pnpm --filter native dev
```

Expo will start Metro and wait on `http://localhost:8081`.

## Build (sanity check)

```bash
pnpm build
```

