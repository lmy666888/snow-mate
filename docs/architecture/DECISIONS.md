# Architecture decisions

| ID | Decision | Rationale and tradeoff |
|---|---|---|
| ADR-001 | Use supplied current workspace, not prompt's illustrative ~/Projects path | Initial audit proved this workspace is the empty Snowmate repo; avoids touching other projects. |
| ADR-002 | pnpm workspace with apps/mobile and two small contract packages | Makes protocol/types shareable without a monorepo task framework or premature services. Lockfile included as a reviewable artifact. |
| ADR-003 | Current Expo SDK 58 template versions, Expo Router, native StyleSheet tokens | Registry and official docs verified SDK 58. Expo install compatibility check pins native modules. No NativeWind/custom native module complexity. Actual iPhone verification remains outstanding. |
| ADR-004 | Five tabs with Prices under Trips and Profile as fifth tab | Preserves all five broad product domains and five-tab review requirement; prices remain a prominent Trips entry. |
| ADR-005 | Static fixtures + ephemeral UI state until approval | Delivers reviewable interaction without crossing mandatory feature gate. No durable matches, auth, AI, motion generator or network side effects. |
| ADR-006 | Minimal Zustand preview store + QueryClient provider with no endpoints | Share only name/stance/level/save flag/notice. Keeps future server state separate without a fake repository layer. |
| ADR-007 | Eleven essential SQL tables now, remaining fourteen entities documented | Validates hard auth/match/membership/privacy boundaries early, defers feature-specific schemas until implementation needs them. Migration is local-only, not mobile-integrated. |
| ADR-008 | Definer matching RPC and read helpers with restricted grants | Canonical pair + advisory transaction lock prevents unilateral/duplicate matches; helpers avoid recursive membership RLS. Rate limits/concurrency load tests remain integration work. |
| ADR-009 | Synthetic-only client session inserts, no origin updates | A client cannot self-assert verified real measurements. Trusted validation/ingestion is future work. |
| ADR-010 | Versioned provider contract now, implementation after gate | User explicitly places deterministic MockMotionProvider after UI approval. Future board-frame units/time metadata are specified before BLE work. |
| ADR-011 | Bundle replaceable licensed stock media and label fictional identities | Demo can render after bundle load without network imagery. Landscape is not a verified resort photo and portrait is not a real Snowmate member. |
| ADR-012 | Browser screenshots + JS bundle export instead of claiming native runtime | This host has Command Line Tools only. Full Xcode/Simulator and physical device validation cannot be fabricated. |
| ADR-013 | No Supabase client/AI edge functions until approval | Credentials are unnecessary for this review, and backend connection is explicitly later scope. No production deploys or paid services. |

| ADR-014 | Owner-directed pale pink base, mauve accents, Allura script wordmark | Latest explicit UI feedback overrides original dark-first concept. Bundled OFL font keeps branding offline; body remains native for readability. Light interface and dark StatusBar content are the current review target. |

| ADR-015 | M1.1 phrase-key en/zh resources at shared UI boundaries | Keeps inherited prototype routes translated through AppText/Button/Field while dynamic user inputs remain original. Static key audit and en/zh interpolation parity are tested. Language never derives region. |
| ADR-016 | Device-local identity and media adapters, no pretend auth/upload | M2.0 owns real Supabase auth. Native document files and Web IndexedDB retain local photos; actual native behavior remains device-test work. |
| ADR-017 | Pure social rules + deterministic repository + versioned local store | Filters/history/blocks affect actual demo results; seeded reciprocity alone creates demo matches. Replacing data access later cannot turn fixture flags into real authorization. |
| ADR-018 | Main protection enabled; M1.1 is an unmerged PR | Required checks/review/admin enforcement are API-confirmed. No automatic milestone acceptance, final tag or release. |
