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

## Environment variables

In a Turborepo monorepo, each app should own its own environment file(s).
Next.js and Expo will automatically load `.env.local` from their app directory.

Start by copying the example env file:

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/native/.env.local
cp .env.example apps/worker/.env.local
```

Then delete unused keys per app and replace placeholders.

### `apps/web/.env.local` (Next.js backend + auth)

Required:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `DATABASE_URL`

Optional:

- `BETTER_AUTH_TRUSTED_ORIGINS` (comma-separated)

Notes:

- `DATABASE_URL` should use port **5435** for the local Docker command below.
- The `pnpm db:push` script loads env from `apps/web/.env.local`.
- `BETTER_AUTH_TRUSTED_ORIGINS` should include **every** frontend origin that will call auth endpoints (web app, Expo web preview, emulator/device URLs). This repo does **not** hardcode dev origins in code.

### `apps/native/.env.local` (Expo app)

Required:

- `EXPO_PUBLIC_WEB_BASE_URL`
- `EXPO_PUBLIC_APP_SCHEME`

Notes:

- **Do not** put server secrets here (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.).
- Only `EXPO_PUBLIC_*` variables are intended to be embedded in the client bundle.
- If you are running on a **real device** or an **Android emulator**, `http://localhost:3000` will not point to your dev machine:
  - **Android emulator**: set `EXPO_PUBLIC_WEB_BASE_URL="http://10.0.2.2:3000"`
  - **Real device (same Wi‑Fi)**: set `EXPO_PUBLIC_WEB_BASE_URL` to your machine’s LAN URL (the Next dev server prints a `Network` URL like `http://192.168.x.x:3000`)
  - When you change `EXPO_PUBLIC_WEB_BASE_URL`, also add that origin to `BETTER_AUTH_TRUSTED_ORIGINS` in `apps/web/.env.local` (otherwise auth will reject requests as an invalid origin).

### `apps/worker/.env.local` (Node worker)

Whether the worker needs a `.env.local` depends on what it does:

- If it talks to Postgres directly, it should have `DATABASE_URL`.
- If it calls the web API, it may need `BETTER_AUTH_URL` (or another base URL you define later).

In production, prefer providing env vars via your runtime (Docker/Kubernetes/host), not by baking `.env.local` files into images.

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

## Database Setup

Make sure you have a PostgreSQL database set up in docker.

```bash
docker run --name sellitems -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=sellitems -p 5435:5432 -d postgres
```

Apply the schema/migrations:

```bash
pnpm db:push
```