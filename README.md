# Ultra

Ultra is a mobile-first energy orchestration app built around circadian baseline, ultradian rhythm tracking, and task scheduling informed by biometric signals.

This repo currently contains the base scaffold:
- an Expo mobile app shell
- a tRPC server shell
- shared Zod and TypeScript domain contracts
- Prisma setup for local development
- Docker support for bringing up the API in a repeatable way

## Repo layout

- `apps/mobile` — Expo app and first `Today` screen shell
- `apps/server` — tRPC server, Prisma schema, and domain services
- `packages/shared` — shared schemas and types consumed by mobile and server
- `docker-compose.yml` — local API container setup
- `ultra-mvp-plan-mobile-first-energy-orchestrator-for-closed-alpha.md` — product plan snapshot

## Requirements

- Node.js 24+
- pnpm 10+
- Docker Desktop, if you want to test through containers

## Local development

1. Install dependencies:

```bash
pnpm install
```

2. Create local env values:

```bash
cp .env.example .env
```

3. Generate the Prisma client and sync the local database:

```bash
pnpm db:generate
pnpm db:push
```

4. Run checks:

```bash
pnpm typecheck
```

5. Start the apps:

```bash
pnpm dev:server
pnpm dev:mobile
```

## Docker testing

The current Docker setup is intentionally narrow: it runs the server with a persisted SQLite volume so the API can be exercised without starting it manually on the host.

```bash
docker compose up --build -d server
curl http://127.0.0.1:3001/health.status
docker compose logs -f server
docker compose down
```

If Docker fails with a daemon socket error, Docker Desktop is installed but not running.

## Useful commands

```bash
pnpm dev
pnpm dev:server
pnpm dev:mobile
pnpm typecheck
pnpm db:generate
pnpm db:push
```

## Current status

- Mobile scaffold exists with mock energy data and avatar UI
- Server scaffold exposes `health`, `profile`, `tasks`, and `energy` routers
- Prisma 7 is configured with `prisma.config.ts`
- Docker files exist for API-only local testing

## Next steps

1. Wire Expo to the server through a real tRPC client.
2. Add Better Auth on the server and mobile auth flow.
3. Replace seed task and energy responses with database-backed services.
4. Expand local Docker to include Postgres when the app moves off SQLite.
