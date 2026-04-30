# Ultra

Ultra is a mobile-first energy orchestration app that combines circadian baseline, ultradian rhythm, biometrics, calendar context, and task scheduling into a single MVP stack.

## What is in this repo

- `apps/mobile` - Expo Router app with `Today`, `Calendar`, and `Profile` tabs plus an internal tasks screen
- `apps/server` - tRPC server, Prisma schema, SQLite-backed services, and recommendation logic
- `packages/shared` - shared Zod schemas and TypeScript types for tasks, profile, biometrics, energy, and recommendations
- `docker-compose.yml` - API-only local container setup
- `ultra-mvp-plan-mobile-first-energy-orchestrator-for-closed-alpha.md` - product plan snapshot

## Current MVP surface

### Mobile

The mobile app is no longer just a shell. It currently includes:

- a `Today` screen with animated energy-state UI, avatar, gauge, and next-task card
- a `Calendar` screen with focus-window highlights and accept / ignore recommendation flows
- a hidden `Tasks` screen used for task buckets and suggested placements
- a `Profile` screen showing avatar state and connected calendar providers
- custom Quicksand typography, NativeWind styling, dark/light theme support, and local Lottie assets

### Server

The server exposes these tRPC routers:

- `health.status`
- `profile.getMe`, `profile.updatePreferences`
- `tasks.list`, `tasks.create`, `tasks.update`, `tasks.complete`, `tasks.delete`, `tasks.byBucket`
- `biometrics.ingestSample`, `biometrics.listSamples`, `biometrics.getLatestState`
- `energy.getLatestState`, `energy.getTodayTimeline`, `energy.recompute`, `energy.getSnapshots`
- `recommendations.list`, `recommendations.generate`, `recommendations.accept`, `recommendations.dismiss`

The current backend uses Prisma with SQLite for local development and includes MVP energy and recommendation engines built from biometric samples, sleep sessions, preferences, tasks, and calendar events.

## Data model

Prisma models currently cover:

- users and preferences
- tasks
- energy snapshots
- biometric samples
- sleep sessions
- calendar connections and calendar events
- recommendations
- nudges

## Requirements

- Node.js 24+
- pnpm 10+
- Docker Desktop if you want to run the server in a container

## Local development

1. Install dependencies.

```bash
pnpm install
```

2. Create local env values.

```bash
cp .env.example .env
```

Current env vars:

- `DATABASE_URL` - local Prisma database, defaults to `file:./prisma/dev.db`
- `BETTER_AUTH_SECRET` - placeholder for upcoming auth wiring
- `BETTER_AUTH_URL` - server base URL, defaults to `http://localhost:3001`
- `EXPO_PUBLIC_API_URL` - mobile app API base URL

3. Generate the Prisma client and sync the local database.

```bash
pnpm db:generate
pnpm db:push
```

4. Run typechecks.

```bash
pnpm typecheck
```

5. Start the server and mobile app.

```bash
pnpm dev:server
pnpm dev:mobile
```

Or run both together:

```bash
pnpm dev
```

## Useful commands

```bash
pnpm dev
pnpm dev:server
pnpm dev:mobile
pnpm --filter @ultra/mobile ios
pnpm --filter @ultra/mobile android
pnpm typecheck
pnpm db:generate
pnpm db:push
```

## Docker

The Docker setup is intentionally narrow and runs only the API with a persisted SQLite volume.

```bash
docker compose up --build -d server
curl http://127.0.0.1:3001/health.status
docker compose logs -f server
docker compose down
```

If Docker fails with a daemon socket error, Docker Desktop is installed but not running.

## Current status

- Mobile UI is an MVP prototype backed by local mock dashboard data, not live server data yet
- Server routers and Prisma models are implemented beyond scaffold level
- Better Auth is installed and partially stubbed, but full auth flows are not wired yet
- Calendar integration shown in the mobile UI is currently demo data, not a live provider sync

## Next steps

1. Replace mobile mock dashboard data with a real tRPC client and live API calls.
2. Finish Better Auth wiring across server and Expo.
3. Add real calendar sync and persistence flows.
4. Expand seeding, tests, and validation around the energy and recommendation engines.
