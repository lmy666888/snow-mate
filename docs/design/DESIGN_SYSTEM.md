# Snowmate design system

Implementation source: `apps/mobile/src/theme/tokens.ts`, `src/components/ui.tsx` and feature screens. The pale pink direction is the current candidate awaiting owner approval. All visible copy is an English-language design candidate; no multilingual runtime yet.

## Palette — owner-directed blush revision
| Role | Token | Hex |
|---|---|---|
| Pale pink canvas | background | #FFF1F4 |
| Warm white cards | surface | #FFFAFC |
| Soft rose secondary surfaces | raised | #F5E4EC |
| Rose separators | border | #E8CEDA |
| Plum charcoal primary text | text | #493541 |
| Muted rose supporting text | muted | #806572 |
| Mauve primary action | accent | #885A7C |
| White action text | ink | #FFFFFF |
| Calm positive state | green | #536E60 |
| Likes / pass accent | coral | #B96780 |
| Synthetic / provenance note | gold | #8A6840 |
| Warm translucent photo panel | overlay | #FFF6F2ED |

The owner explicitly replaced the initial dark navy concept with a pale pink foundation, a script Snowmate wordmark, and a softer, less masculine visual character. This latest instruction overrides the initial dark-mode-first preference. Light mode is implemented; a separate dark theme is not yet designed. Mountain photography and snowboard domain content remain. No neon/glowing borders or excessive gradients. Photo captions use warm, readable panels. Fictional/live provenance never relies only on color.

## Typography and rhythm
The Snowmate wordmark uses bundled Allura (SIL OFL 1.1), loaded with expo-font: 35/42 in page headers and 44/52 on welcome. Body and other headings use the native system font (San Francisco on iOS). Font loading has an activity indicator and an error fallback; no remote font service. Caption 10–11/16; label 12–13/18; body 15/23; section 19; title 23/30; display 34/40; welcome hero 49/52. Weights 400, 600, 700. Large headlines use restrained negative tracking; uppercase eyebrows use 2–4-point tracking. Dynamic text scaling is enabled by default; headings wrap without fixed line limits. Largest accessibility sizes still need device review.

Spacing tokens: 4, 8, 12, 16, 24, 32, 48. Screen horizontal inset 22 (welcome content 26–28); vertical content gap 20. Cards have 20 inset, 16 inner gap, radius 20; hero/rider radius 24; sheets 28; chips pill radius. Controls minimum 44 high; primary/secondary buttons minimum 52. Secondary detail pages scroll to protect content at smaller sizes. Layout shell max width 560 on tablets/desktop, centered; responsive single-column iPhone layout.

## Component inventory and specifications
| Component | Implementation and states |
|---|---|
| AppText | body/caption/label/title/display variants; native text scaling; color overrides from tokens |
| AppButton | primary mauve, secondary raised, ghost; pressed opacity; disabled 40% with native disabled semantics; optional icon |
| AppCard / Row | reusable warm-white card with a rose border and aligned horizontal layout |
| ScreenContainer / PageHeader | safe-area top/side, scroll, screen padding, max width; back fallback; optional right action |
| IconButton | circular 44/62/72 controls, accessible labels, pressed state |
| Avatar | bundled stock portrait, circular crop and subtle border |
| Badge / Chip / ChoiceGroup | provenance and skill/stance badges; minimum 44-point selectable chips; accessible selected state |
| Rider card | feature-specific large portrait, fictional identity, level/stance/resort/interests, drag/pass/like/details; not a public reusable component yet |
| HeroCard | shared photo card used for resort and trip layouts, overlay/caption/optional action |
| PriceCard | feature component, currency/provider/date provenance, detail action; no purchase in demo |
| MotionChart | accessible SVG fixture plot, units and synthetic badge, time labels; not an analysis result |
| Field | labeled text input, multiline/numeric/password variants; no real credentials collected |
| InfoRow / SectionHeader | consistent divider row, action/header sizing |
| EmptyState / LoadingState / ErrorState | gallery examples plus real saved-trip empty state; retry changes gallery preview state |
| BottomSheet | native Modal sheet with scrim, handle, close control, back request handling |
| Match success | root Stack modal route, sample celebration, chat/continue actions; native modal behavior untested |
| PrototypeNote / toast | context about visual/local behavior and visible success acknowledgment, dismiss control |

## Navigation
Welcome → auth design → snowboard profile → riding preferences → tabs; skip opens Discover. Five tabs: Discover, Trips, Coach, Community, Profile. Matches/chat/profile detail branch from Discover. Planner/results/detail/resort and Prices/offer branch from Trips. Start/live/summary/analysis/practice/history branch from Coach. Posts/create branch from Community. Edit/history/settings/saved trips branch from Profile. Settings can reopen onboarding and component state gallery.

## Interaction and animation
Swipe follows horizontal drag with ±12° interpolation over 250 points; threshold 100 points; decision label is shown beyond 35. Release under threshold springs back; a completed swipe exits in 220 ms before cycling the fixture deck. Like opens a sample modal; it is not real matching. Buttons are an accessible alternative to dragging. Standard navigation transition is platform slide-from-right, match fade, sheet slide. No continuous chart animation or gratuitous effects. Reduced-motion handling must be tested; the implementation disables decorative card rotation and shortens completion when enabled (see hook). No advanced animation work before approval.

## Accessibility and remaining QA
Safe-area context and StatusBar dark-content styling; chart has a semantic text description, no color-only categories; icon buttons labeled; switches labeled; chip state exposed; text defaults allow scaling. Browser navigation tested at mobile sizes. VoiceOver order, modal focus trapping/return focus on native, contrast over every crop, reduced-motion hardware behavior, keyboard avoidance and largest Dynamic Type require iPhone review. No accessibility conformance certification claimed.

## Imagery
See `assets/ATTRIBUTION.md`. Mountain and cabin photography are generic placeholders, not verified depictions of named resorts. Rider photograph represents fictional members; do not imply endorsement. Replace with rights-cleared product photography and consenting profile uploads before launch.
