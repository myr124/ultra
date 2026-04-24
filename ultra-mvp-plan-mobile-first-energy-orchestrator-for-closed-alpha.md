# Ultra MVP Plan: Mobile-First Energy Orchestrator for Closed Alpha

## Summary
Build a mobile-first Expo app for a small closed alpha on iOS, backed by a tRPC/Zod/Prisma API and Better Auth. The MVP will ingest mocked-but-production-shaped biometric data, maintain a per-user energy model, surface a sliding energy calendar, and recommend task allocation across `Work`, `Fitness`, and `Fun`. Calendar integration is read-only, nudges are delivered in-app plus notifications, and the avatar is a stateful 2D representation of current energy/redline state.

This plan assumes a greenfield repo. It is optimized for the first shippable slice, not for the full roadmap.

## Product Scope

### In scope
- Email-based authenticated multi-user closed alpha
- Native task management inside Ultra with three fixed buckets:
  - `Work`
  - `Fitness`
  - `Fun`
- Read-only external calendar sync for existing events
- Mock biometric ingestion pipeline with real integration boundaries for:
  - HRV
  - Heart rate
  - Glucose
  - Sleep stages
- Energy fingerprinting engine with:
  - circadian baseline
  - ultradian wave
  - composite energy index
  - redline detection
- AI-assisted task orchestration through a provider-agnostic interface with Gemini as the default provider
- Sliding timeline UI showing:
  - current energy
  - upcoming peaks and troughs
  - sleep pressure
  - scheduled tasks and calendar events
- Stateful 2D avatar reflecting `focused`, `drifting`, `redlining`, and `recovering`
- In-app and notification-based nudges for breaks and recovery

### Out of scope
- Real Tidal API integration in MVP
- Two-way calendar write-back
- Widget implementation
- Nutrition/snack recommendation engine
- Full adenosine physiology modeling beyond a practical sleep-pressure heuristic
- Android release as a launch gate
- Team collaboration, shared calendars, admin tooling

## User Flow
1. User signs in and completes onboarding.
2. User connects a read-only calendar.
3. User creates tasks in `Work`, `Fitness`, and `Fun`.
4. System seeds biometric streams from mock providers.
5. Engine computes:
   - daily circadian baseline
   - current ultradian phase
   - composite energy index
   - redline state
6. Timeline shows recommended blocks and recovery windows.
7. Orchestration service proposes task placements.
8. User accepts, dismisses, or reschedules suggestions.
9. Nudge service triggers in-app/push alerts when:
   - redline threshold is crossed
   - cognitive ROI drops
   - a recovery window begins
10. Avatar state updates continuously from energy state.

## Architecture

### Frontend
- Expo React Native app, iOS-first
- Navigation with four primary surfaces:
  - `Today`
  - `Calendar`
  - `Tasks`
  - `Profile`
- Core UI modules:
  - `EnergyAvatar`
  - `EnergyGauge`
  - `SlidingTimeline`
  - `RecommendationCard`
  - `TaskBucketBoard`
  - `RecoveryPrompt`
- Local state:
  - server state via tRPC client
  - lightweight local UI state only
- Notification handling:
  - Expo Notifications for local/push delivery
- Design direction:
  - expressive, high-contrast visual language
  - 2D avatar states with subtle motion
  - timeline-first information hierarchy

### Backend
- Node service with:
  - tRPC routers
  - Zod validation
  - Prisma ORM
- Default persistence:
  - PostgreSQL
- Major backend domains:
  - auth
  - users
  - tasks
  - calendar sync
  - biometrics ingestion
  - energy engine
  - orchestration
  - nudges

### Auth
- Better Auth with email magic link as the default closed-alpha flow
- User model supports multiple users but no org/workspace abstraction
- Calendar tokens stored per user/provider

### AI orchestration
- Define a provider interface:
  - `generateScheduleRecommendations(input): RecommendationSet`
- First provider implementation:
  - Gemini
- Add deterministic fallback rules when provider fails or times out
- LLM is advisory, not authoritative; final task placements must pass rule validation

## Core Domain Model

### Public interfaces and types
These should be first-class shared types across client/server packages.

#### Energy state
```ts
type EnergyState = {
  timestamp: string
  circadianBaseline: number
  ultradianPhase: "peak" | "transition" | "trough"
  compositeIndex: number
  sleepPressure: number
  redline: boolean
  confidence: number
}
```

#### Biometric sample
```ts
type BiometricSample = {
  userId: string
  source: "mock" | "tidal"
  type: "hrv" | "heart_rate" | "glucose" | "sleep_stage"
  value: number | string
  unit: string
  recordedAt: string
}
```

#### Task
```ts
type TaskBucket = "work" | "fitness" | "fun"

type Task = {
  id: string
  userId: string
  title: string
  bucket: TaskBucket
  durationMin: number
  effort: "low" | "medium" | "high"
  flexibility: "fixed" | "moveable"
  status: "todo" | "scheduled" | "done" | "skipped"
  preferredTimeOfDay?: "morning" | "midday" | "evening"
}
```

#### Calendar event
```ts
type CalendarEvent = {
  id: string
  userId: string
  provider: "google" | "apple" | "outlook"
  title: string
  startsAt: string
  endsAt: string
  busy: boolean
  imported: true
}
```

#### Recommendation
```ts
type Recommendation = {
  id: string
  userId: string
  type: "focus_block" | "recovery_break" | "fitness_slot" | "fun_slot"
  rationale: string[]
  startsAt: string
  endsAt: string
  taskId?: string
  energyTarget: "peak" | "transition" | "trough"
}
```

#### Avatar state
```ts
type AvatarState = "focused" | "drifting" | "redlining" | "recovering" | "offline"
```

### Prisma entities
Create tables/models for:
- `User`
- `Session`
- `Account`
- `CalendarConnection`
- `CalendarEvent`
- `Task`
- `BiometricSample`
- `SleepSession`
- `EnergySnapshot`
- `Recommendation`
- `Nudge`
- `UserPreference`

## Backend Behavior

### Energy engine rules
Use deterministic heuristics in MVP.

#### Circadian baseline
- Derived from previous-night sleep duration and sleep-stage quality
- Output is a normalized `0-100` baseline ceiling for the day
- If sleep data is missing, fall back to user-entered bedtime/wake-time defaults

#### Ultradian wave
- Simulate 90-120 minute cycles from wake time
- Peak/trough alternation is softened by current HRV and glucose
- Missed recovery breaks reduce confidence and dampen the next peak

#### Composite energy index
- Weighted score from:
  - HRV trend
  - heart-rate strain
  - glucose stability
  - circadian baseline
  - sleep pressure
- Return normalized `0-100`

#### Redline detection
Trigger redline when all are true for a rolling window:
- heart rate elevated beyond personal baseline
- HRV depressed below personal baseline
- user is in a sedentary context or has no workout scheduled
- task/cognitive load is active or inferred from focus block
Default to a 10-15 minute confirmation window to avoid false positives.

#### Cognitive ROI nudge
Trigger a recovery suggestion when:
- composite energy is falling
- user is inside a focus block
- redline is true or trough onset is imminent
Recommendation:
- 5-minute break
- light walk
- hydration
- breathing reset

### Scheduling/orchestration rules
1. Hard calendar events are immovable blockers.
2. User tasks are placed only in free windows.
3. `Work` tasks prefer peak windows.
4. `Fitness` tasks prefer transition or secondary peaks.
5. `Fun` tasks fill troughs and post-work decompression.
6. High-effort tasks cannot be placed in low-energy troughs unless user explicitly overrides.
7. Every 90-120 minutes of sustained focus should include a recovery candidate.
8. LLM recommendations must be filtered through these rules before persistence.

## API Surface

### tRPC routers
- `auth`
  - `getSession`
- `profile`
  - `getMe`
  - `updatePreferences`
- `tasks`
  - `list`
  - `create`
  - `update`
  - `complete`
  - `delete`
- `calendar`
  - `connectProvider`
  - `sync`
  - `listEvents`
- `biometrics`
  - `ingestSample`
  - `listSamples`
  - `getLatestState`
- `energy`
  - `getTodayTimeline`
  - `recompute`
  - `getSnapshots`
- `recommendations`
  - `list`
  - `generate`
  - `accept`
  - `dismiss`
- `nudges`
  - `list`
  - `acknowledge`

### Internal service boundaries
- `BiometricProvider`
  - `fetchSamples(userId, range)`
- `EnergyEngine`
  - `computeState(userId, at)`
  - `computeTimeline(userId, date)`
- `ScheduleOrchestrator`
  - `generateRecommendations(userId, date)`
- `NudgeEngine`
  - `evaluateTriggers(userId, at)`

## Frontend Screens

### Today
- Hero avatar with current state
- Current energy gauge
- Active recommendation card
- Redline/recovery banner if relevant
- Next three recommended blocks

### Calendar
- Horizontal sliding timeline
- Overlays for:
  - energy curve
  - imported calendar events
  - scheduled tasks
  - recovery windows
- Tap a block to inspect rationale

### Tasks
- Three columns or segmented views for `Work`, `Fitness`, `Fun`
- Quick add task
- Effort and duration controls
- Suggested scheduling status

### Profile
- Auth/session state
- Calendar connection status
- Notification preferences
- Mock biometric mode indicator
- Chronotype/wake-time preferences

## Milestones

### Milestone 1: Foundation
- Initialize monorepo/app structure
- Set up Expo app, backend app, shared types package
- Configure Better Auth, tRPC, Zod, Prisma
- Stand up PostgreSQL and initial schema
- Implement email auth and protected routes

### Milestone 2: Core data and mock ingestion
- Build task CRUD
- Build calendar connection abstraction with stubbed read-only provider
- Implement mock biometric provider and seed jobs
- Persist biometric samples and sleep sessions

### Milestone 3: Energy intelligence
- Implement energy engine heuristics
- Generate daily energy snapshots and timeline
- Implement redline detection and sleep-pressure heuristic
- Expose timeline and current state APIs

### Milestone 4: Orchestration and nudges
- Implement recommendation generator with deterministic rules
- Add Gemini-backed provider behind orchestration interface
- Add accept/dismiss workflow
- Add in-app notifications and push/local alert flow

### Milestone 5: UX polish for alpha
- Build stateful 2D avatar system
- Finalize sliding calendar interactions
- Add rationale text for recommendations
- Harden empty/error/loading states
- Prepare closed-alpha seed data and QA scripts

## Testing and Acceptance Criteria

### Unit tests
- Energy engine baseline calculation from sleep inputs
- Ultradian phase generation across a day
- Composite index weighting and normalization
- Redline detection threshold logic
- Recommendation filtering against calendar conflicts
- Task placement by bucket and effort
- Avatar state mapping from energy/redline states

### Integration tests
- Authenticated user can create tasks and fetch timeline
- Mock biometric ingestion updates latest energy state
- Calendar sync imports events without duplicating records
- Recommendation generation respects hard events
- Accepting a recommendation updates task and timeline state
- Nudge creation occurs on redline/trough conditions

### End-to-end scenarios
- New user onboards, connects calendar, creates tasks, sees first schedule
- User with poor sleep gets lower baseline and fewer deep-work recommendations
- User enters redline during sedentary work and receives a break prompt
- User dismisses a recommendation and sees the next-best option
- User with no biometric data falls back to heuristic mode without app failure

### Alpha acceptance criteria
- A signed-in user can see an energy-informed timeline for today
- At least one recommendation is generated for each active day with open time
- Redline detection produces a visible avatar and nudge state change
- Calendar imports do not overwrite native Ultra tasks
- System remains usable when biometric provider is mock-only or temporarily unavailable

## Defaults and Assumptions
- Repo starts empty; implementation will scaffold from scratch.
- Database is PostgreSQL.
- Auth uses Better Auth with email magic links by default.
- Calendar MVP supports read-only Google Calendar first; provider interface remains extensible.
- Tidal remains behind a provider boundary; MVP ships with mock data only.
- Gemini is the default orchestration provider, but all orchestration calls go through a provider-agnostic interface.
- iOS is the only release target for MVP; Android compatibility is desirable but not a release gate.
- Notifications use Expo’s notification stack.
- Avatar is 2D and state-driven, not a custom animation engine.
- Sleep pressure is modeled heuristically from wake time and sleep debt, not as a clinically precise adenosine model.
- Recommendation acceptance updates Ultra’s internal schedule only; no calendar write-back occurs in MVP.
