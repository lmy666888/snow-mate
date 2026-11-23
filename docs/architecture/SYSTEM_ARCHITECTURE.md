> M1.0 historical architecture below. M1.1 adds `i18n`, `features/identity`, `features/regions`, `services/photos[.web]`, `stores/social`, `social/demoRepository`, pure logic and validated persistence. Current behavior/status is documented in `docs/releases/M1.1_ENGINEERING_REPORT.md`. The old ephemeral social/profile description is not the current M1.1 implementation; Trips/Prices/Coach/Community remain prototypes.

# System architecture

## Implemented topology
```
Expo Router app routes
  → src/features/{auth,social,trips,pricing,coach,community,profile}/screens.tsx
  → shared components + theme/tokens.ts
  → local React screen state / stores/prototype.ts (Zustand, memory only)
  → bundled images and fixed feature fixtures

AppProviders → GestureHandlerRootView → SafeAreaProvider → QueryClientProvider
packages/shared-types → Rider, TicketOffer, Stance, SkillLevel, DataOrigin
packages/sensor-protocol → version 1.0.0 and SensorProvider contract only
supabase/migrations → essential schema and RLS (not linked to app)
```

React Native/Expo SDK 58, Router, TypeScript, Reanimated, Gesture Handler, Zustand, TanStack Query. React Native's Animated/PanResponder drive the single swipe preview; no Reanimated worklet dependency in application code. Gesture Handler root is ready for post-approval native gesture work. React Query is configured with retries off and 60-second stale time; no query endpoints exist yet. NativeWind was omitted: a small token-based StyleSheet library is sufficient.

## Domain boundaries
Auth owns onboarding design, not sessions. Social owns rider fixtures/card movement/matches/chat previews. Trips owns fixed itinerary and planner design, links to Pricing. Pricing owns offer provenance contracts and USD formatting. Coach owns fixture views and labels; it does not infer technique. Community owns post design. Profile owns name/stance/level settings and saved-trip view. Shared components must not query backend/domain stores except the generic notification channel. The current `prototype` store is intentionally small and disposable; split it into real feature stores after approval rather than expanding it into a global production model.

Router files are small exports; screen implementations stay outside the route tree. Five tabs render within a max-width 560-point shell on larger displays. Secondary screens use root Stack navigation with back fallback to Discover. Match success is a native modal route. Onboarding can be revisited from Settings.

## Data flow and state lifetimes
Fixed imports → render. Screen input edits → screen React state; disappear on unmount. Name/stance/level and sample saved trip → in-memory Zustand; survive navigation but reset on JS reload. Chat, likes/comments, planner inputs, itinerary edits, and privacy switches are not persisted. The planner result is independent of inputs and says so. The price controls do not change fixed sample offers and say so. Share uses React Native Share only upon a user tap.

## Demo and offline behavior
Demo does not initialize Supabase or ask for credentials. Images ship with the app. With a loaded JS bundle it renders offline; Metro/Expo Go must obtain the bundle first. Web service worker caching, offline writes, conflict resolution and background synchronization are not implemented. No fake success represents a remote write. Global notices explicitly describe preview outcomes.

## Planned backend/auth model (not integrated)
After approval: client uses public Supabase URL + publishable/anon key only, Supabase Auth yields JWT, repositories make JWT-scoped queries/RPCs, RLS remains authority. Platform-specific secure persistence for refresh tokens must be selected and tested before auth ships. Auth needs loading, expired-session, sign-out and offline states. Explicit user-selected demo mode must never silently change an authenticated user's data source following an outage.

`record_swipe(target, decision)` owns canonical reciprocal matching and conversation creation in one transaction. No client grants to insert matches or members. Conversation access checks live membership and both directions of blocks. Private motion sessions are not part of discovery queries. Realtime channels must use authenticated RLS and be audited independently before enabling publication.

Edge Functions will verify JWT, enforce quotas, call AI vendors with server-held keys, validate structured outputs and retain prompt/model/provenance metadata. No Edge Function stubs are deployed. Pricing adapters must retain original provider URL, currency, visit date, retrieved/verified times, taxes and cache expiry. A stale/unverified quote must never become “live” by formatting alone.

## Failure and safety boundaries
Loading/empty/error/retry/success components are reviewable under Profile → Settings → component gallery. This is a gallery, not simulated network recovery. Remote error mapping, query cancellation, retry/backoff, drafts, and crash reporting are future work. No hardcoded credentials or environment files are consumed. SQL helper functions use empty search paths, schema-qualified relations, restricted execute grants. No administrative field exists in editable profile rows. Production must add RPC abuse limits, moderation operations, authenticated upload policies and concurrency/load tests.

## Future motion and hardware
The provider interface is versioned independently of views. Session-level origin and calibration are mandatory; screens consume batches/reports, not BLE packets. Mock provider, ingestion buffering, encrypted private Storage objects and Python-compatible serialized contracts follow approval. BLE permissions, device clocks, audio coaching and goggles are future phases, with no custom native modules introduced today.
