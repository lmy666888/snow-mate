# Integration contracts and Day 2 prerequisites

## Implemented now
- `@snowmate/shared-types`: Rider, TicketOffer, Stance, SkillLevel, DataOrigin, FeatureStage.
- `@snowmate/sensor-protocol`: version 1.0.0, Vector3, MotionSample, SensorProvider interface. No implementation.
- SQL RPC `public.record_swipe(target uuid, decision text) → uuid | null`: authenticated JWT required; decision like/pass; null means no reciprocal match. Errors cover authentication, invalid swipe, unavailable rider. No mobile call exists.
- Read helpers `is_blocked(uuid) → boolean`, `can_access_conversation(uuid) → boolean` are RLS internals, not a general identity lookup service.

## Planned adapter seams (not code)
AuthGateway should expose explicit auth/demo/expired/loading state and secure session persistence. SocialRepository should read discovery-safe profiles, call matching RPC, and subscribe only to authorized conversations. TripPlannerGateway should receive validated coarse origin/date/budget/group/level/transport/stay/request fields and return a structured draft with origin, warnings and provenance. PricingRepository should never manufacture lastVerifiedAt/sourceUrl for missing fields. MotionAnalysisGateway must require origin, protocol/algorithm/calibration versions and quality diagnostics with every report.

All server adapters validate inputs independently of mobile forms. No client should send user IDs as authority when JWT already establishes actor identity. Error envelopes need a stable code, user-facing retry guidance, request ID, and no secret/provider payload leakage. These envelopes will be finalized alongside actual Edge Functions, rather than shipping fake integrations today.

## Required configuration after owner approval
1. Owner-owned Supabase development project, URL and publishable key; apply migration in staging, configure auth redirect scheme `snowmate://`, test sessions and deletion. Service-role credentials remain server-side only.
2. AI vendor/model choice, spending limits, server-only key, structured response schema, fallback/error copy and data-use policy. Trip generations must be drafts, never bookings or safety guarantees.
3. Licensed pricing provider/feed or permitted official API with taxes, availability, update windows, deep links and redistribution terms. No scraping or invented current quotes.
4. Motion envelope implementation and deterministic provider tests before any sensor stream. No claim of coaching correctness without labeled real measurements and evaluation.
5. Full Xcode or physical iPhone + matching SDK 58 Expo Go/development client for native gestures, safe areas, permissions, text and keyboard checks.

No scheduled jobs, Edge Functions, Storage buckets, realtime publications or production deployments are created. Day 2 will not start automatically.
