# Snowmate product requirements

## Vision and audience
A premium iPhone-first snowboarding companion: find people who ride at your pace, organize a mountain escape, understand the provenance of ticket offers, and explore motion feedback responsibly. Android remains an architectural target. Only snowboarding is modeled; stances are Regular and Goofy.

Primary users: weekend riders organizing Northeast US trips, solo riders finding a compatible crew, and developing riders interested in understanding motion. UI copy is English for this review; owner communication and review instructions are Chinese. Localization is deferred.

## User journeys and current acceptance
1. Open welcome → preview sign-in → edit snowboard profile → riding preferences → discover, or skip directly into demo without credentials.
2. Move a discovery card with a horizontal drag or Pass/Like button → view rider details → sample match celebration → sample matches/chat. This is visual prototype behavior: likes do not run real mutual matching.
3. Trips → planner inputs → fixed sample results → itinerary with temporary activity edits/save/share → resort → price comparison → offer details.
4. Coach → start preview → scenario controls → fixed motion fixture → summary → analysis → general practice ideas/history. Synthetic origin is visible throughout; no actual recording or quality scoring.
5. Community → sample post → temporary like/comment; create-post controls acknowledge that nothing is published.
6. Profile → edit name/level/stance in memory → saved itinerary → history → settings/privacy preview.

## Sprint priorities
| Stage | Priority | Scope |
|---|---|---|
| Day 1 before UI approval | P0 | Expo workspace, design tokens, complete navigable high-fidelity screen inventory, essential migration/RLS, docs, review screenshots and checks |
| Day 1 after explicit approval | P1 | Demo social state machine and persistence, auth foundation with explicit demo fallback, validated planner/calendar/drafts, deterministic MockMotionProvider |
| Day 2 after separate go-ahead | P1 | Supabase integration, edge-function AI trip draft, provenance-aware pricing adapter, sensor analysis groundwork |
| Day 3 | P1 | Device QA, error/recovery behavior, integration tests, scope and release readiness assessment |
| Reduce first | P2 | Realtime chat, advanced animation, community publication, additional integrations |

Approval is a blocking product gate. Silence is not approval. This repository stops before the post-approval feature sequence. The server-controlled mutual-like RPC is an isolated schema/security foundation, not connected to the mobile UI.

## Functional requirements
- FR1: Five primary tabs: Discover, Trips, Coach, Community, Profile. Prices live under Trips; profile/settings accessible from Profile.
- FR2: All specified onboarding and secondary screens contain representative content and navigable actions. Sign-up is a state of the sign-in screen. Match success is presented as a modal on native navigation.
- FR3: Demo is independent of external accounts, keys, live location, sensors, weather, and price services. Data is fixed and fictional. Stock media is bundled.
- FR4: Distinguish fictional offers from verified live quotes with currency, provider, visit date, last verification and source fields. No booking CTA in demo.
- FR5: Do not confuse synthetic motion with measurement or prewritten content with generated coaching. No validated technique scores.
- FR6: UI interactions use ephemeral local/Zustand state. Share invokes the OS/browser share interface only when tapped. No persistence or network mutation is advertised.
- FR7: Essential identity/social tables enforce server authorization, reciprocal-like matching, membership-only messages, block safety, and private motion ownership.

## Nonfunctional requirements
- Strict TypeScript, locked dependency graph, Expo-compatible native libraries, domain-specific files, narrow shared contracts.
- Owner-directed pale pink tokens and a script Snowmate wordmark, scalable native text, minimum 44-point interactive controls, safe areas, scrollable layouts, icon labels, visible disabled/error/empty/loading/success examples.
- No secrets, service role keys, analytics, location collection, production deploys, purchases, or external communications.
- Offline prototype after bundle/assets load; no claim of installed offline web caching or production synchronization.
- Owner review at 393×852 and 375×812 browser viewports; physical iPhone, VoiceOver, largest Dynamic Type, gestures on native hardware, and Android remain release blockers.

## Explicit exclusions
No real auth, backend mobile integration, AI trip generation, live resort inventory/conditions/prices, payments, functional BLE, native custom modules, production community posting, real chat, durable demo social logic, deterministic motion provider implementation, coaching accuracy claims, launch readiness, or Day 2 automation.

## Definition of acceptance
For this gate: app opens, demo skip works, all 32 UI routes are nonempty and reachable, five-tab navigation works, swipe has movement/feedback with button alternatives, planner/result/price/coach/profile have review screenshots, checks pass with honest platform limitations, and owner receives a concrete review package. UI Complete, Demo Functional, Backend Integrated, Tested on iPhone, and Production Ready are separate statuses.
