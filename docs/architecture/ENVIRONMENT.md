# Day 1 environment audit

Date: 2026-11-23 (America/New_York).

- Working directory: `/Users/mingyi/Documents/ChatGPT/snowmate`. This is the supplied workspace; the prompt's `~/Projects/snowmate` path is not used or created.
- Initial contents: `.git` only; no commits, source, dependencies, configuration, or conflicting project to preserve.
- GitHub: `https://github.com/lmy666888/snow-mate` inspected read-only, empty. Configured as origin; working branch `codex/day1-ui-foundation`. No push or deployment.
- Node v24.20.0; npm 12.0.2; pnpm 11.24.0.
- Full Xcode unavailable. `xcode-select -p` returns `/Library/Developer/CommandLineTools`; `xcodebuild -version` and `xcrun simctl list devices booted` fail because full Xcode/Simulator is absent. No iOS runtime or native build claim.
- No global Expo CLI; project-local Expo CLI supplied by locked SDK 58 dependencies.
- PostgreSQL 17.11, initdb, pg_ctl, psql available. Docker executable exists but daemon unavailable. Local SQL tests use a disposable repository-local PostgreSQL cluster, not Supabase or Docker.
- No credentials requested or loaded. No Supabase project linked.

Plan executed: create a pnpm monorepo; use Expo's current SDK 58 template dependency versions; build five-tab React Native prototypes plus secondary routes; implement essential offline SQL policy validation; document future integration; export bundles and capture browser screenshots; stop for owner UI approval.

Official dependency references checked at implementation time: [Expo SDK reference](https://docs.expo.dev/versions/latest/) and [Router manual installation](https://docs.expo.dev/router/installation/). `expo install --check` is the local compatibility check. Native dependencies are Expo Go compatible in principle; actual matching Expo Go version/device availability must be checked on the owner's phone.
