# Testing strategy

- `pnpm typecheck`, `pnpm lint`: strict source/test checks.
- `pnpm test`: Node/tsx business-logic tests; deterministic fixtures, no production services.
- `pnpm test:ui`: Playwright, full Chromium, actual touch events, 393×852 and compact viewport. Fixtures reset via local demo storage; M1.0 screenshots remain archived, M1.1 outputs separated.
- `pnpm build` and iOS Expo export validate bundles/assets, never native signing or device execution.
- `pnpm test:db`: disposable local PostgreSQL cluster, RLS role tests. CI database job uses its own PostgreSQL 17 service.
- CI installs frozen dependencies, scans current files/history, checks types/lint/unit/UI/web+iOS exports and SQL policies. No production credentials.

Run relevant checks after each substantial feature, full suite before milestone handoff. Record exact failed/repaired outcomes, limitations, screenshots and platform. Check hydration, reload persistence, language changes, filter exclusion, mutual demo match, missing images/errors and no network writes. Physical iPhone, VoiceOver, Dynamic Type, Expo image picker/permissions, keyboard and native gestures require separate hardware validation.
