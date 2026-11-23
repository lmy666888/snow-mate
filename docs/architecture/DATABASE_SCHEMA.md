# Database schema and authorization

Migration: `supabase/migrations/202611230001_essential_foundation.sql`. Eleven essential tables implemented and tested on local PostgreSQL 17. No remote migration applied. Remaining entities below are designs, not existing database objects. All table primary keys are UUIDs; `profiles.id` is also the `auth.users.id` foreign key. Other implemented primary keys default to `gen_random_uuid()`.

## Implemented entities
| Table | Foreign keys / important fields | Constraints / access |
|---|---|---|
| profiles | id → auth.users; display_name, bio, level enum, stance enum, home_region, discovery_enabled | Owner insert/update; authenticated discovery reads only enabled nonblocked riders plus self. Discovery-safe fields only. home_region is coarse text, never coordinates. |
| user_preferences | user_id → profiles; riding_styles text[], favorite_resorts text[], trip_distance_km, matching_preferences jsonb | Unique user; owner-only CRUD. Favorite resorts are editorial names, not FK IDs; normalize when favorites become a catalog relation. JSON contains preferences only, not authority/roles. |
| swipe_actions | actor_id / target_id → profiles; action like/pass | Unique ordered pair, nonself; actor-only read; writes only via RPC. |
| matches | user_a / user_b → profiles | Unique sorted pair (`user_a < user_b`); participant-only unblocked reads, no client writes. |
| conversations | match_id → matches | One per match; membership + unblocked read, no client writes. |
| conversation_members | conversation_id → conversations; user_id → profiles | Unique conversation/user; RLS definer helper avoids recursive policies; no client writes. |
| messages | conversation_id → conversations; sender_id → profiles; body, created_at | Body length 1–4000; current sender + authorized unblocked membership insert/read; no update/delete client grants. |
| blocks | blocker_id / blocked_id → profiles | Nonself, unique direction; blocker-only select/insert/delete. Helpers inspect both directions. |
| reports | reporter_id → profiles cascade; target_id → profiles set null; reason | Reporter-only insert/read; moderation queue must use server authority. No client status or admin privilege. |
| resorts | name, region, country_code, official_url | Unique name/region/country; authenticated read; catalog writes server-only. No seed resort rows in SQL. |
| motion_sessions | owner_id → profiles; origin enum, protocol_version, started_at, ended_at | Owner-only read/delete; client can insert synthetic only. No client updates or promotion to verified. Real ingestion reserved for trusted server. |

All other implemented FKs cascade on referenced deletion. Reports lose target identity on target deletion. Messages and match graphs cascade with account profile deletion; deletion of the Auth identity requires a future trusted account-deletion workflow rather than a direct client profile delete.

## Matching transaction
`record_swipe(target uuid, decision text)` requires auth.uid(), valid nonself target, visible discovery target, no block. A transaction-scoped advisory lock hashes the canonical UUID pair, serializing reciprocal swipes. Upsert stores one current swipe per direction. Only two reciprocal likes create a canonical match, a unique conversation, and exactly two unique memberships. Repeated likes are idempotent. A later pass does not delete an existing match; explicit unmatch is a separate future lifecycle operation. Block policies immediately hide existing matches/conversations/messages in both directions even though retained records remain. The RPC is schema groundwork, disconnected from prototype buttons.

## Index strategy
Primary and unique constraints provide owner/actor/canonical-pair lookups. Additional indexes cover discovery by level/stance when enabled; incoming likes; matches by user_b; memberships by user_id/conversation_id; message timeline (conversation_id, created_at, id); reverse blocks; reports target; private sessions (owner_id, started_at DESC); catalog country/region. Use cursor pagination for feeds/messages in later integrations; do not add speculative indexes without query plans.

## Deferred entities: concrete proposed model
These definitions specify intended keys and authorization for feature migrations. They are not promises of implemented functionality.

| Entity | Proposed columns and relations | Uniqueness, indexes and RLS |
|---|---|---|
| trips | id PK; owner_id → profiles; resort_id → resorts; title, starts_on, ends_on, budget_minor, currency, coarse_start_region | dates ordered, budget nonnegative; index owner_id/starts_on; owner + member read; owner edits; no precise public origin |
| trip_members | id PK; trip_id → trips cascade; user_id → profiles; role ('owner','member'), accepted_at | unique trip/user; index user/trip; only owner RPC invites/removes; cannot self-elevate role |
| itineraries | id PK; trip_id → trips cascade; created_by → profiles; version, origin ('demo','ai','manual'), model_version, generated_at | unique trip/version; member reads; owner edits; validated AI draft write server-only |
| itinerary_items | id PK; itinerary_id → itineraries cascade; position, starts_at, title, details | unique itinerary/position; member read; permitted editor update, title/details bounded |
| price_sources | id PK; name, base_url, provider_key, enabled | unique provider_key; read allowed sanitized fields; server-only writes; no API credential column |
| ticket_offers | id PK; source_id → price_sources; resort_id → resorts; visit_date, ticket_type, currency, amount_minor, source_url, origin, verified_at, expires_at | currency ISO, nonnegative amount, live requires URL + verification; index resort/date/type/currency; sanitized read, server ingest only |
| price_observations | id PK; offer_id → ticket_offers cascade; amount_minor, observed_at, fetched_at, provenance_hash | append-only server writes; index offer/observed_at; public-to-auth sanitized reads; retain trend only under provider terms |
| sensor_devices | id PK; owner_id → profiles; external_id_hash, label, firmware_version, calibration jsonb | unique owner/device hash; owner reads; trusted pairing write; no raw BLE identity publicly |
| sensor_chunks | id PK; session_id → motion_sessions cascade; device_id → sensor_devices; sequence_start/end, timestamp_start/end_us, storage_path, checksum, quality jsonb | unique session/device/sequence_start; index session/time; session-owner only, checksummed ingestion server-only; storage authorization tied to session |
| motion_events | id PK; session_id → motion_sessions cascade; chunk_id → sensor_chunks; event_type, timestamp_us, algorithm_version, confidence | index session/timestamp; owner reads; versioned analysis service writes; confidence not a skill score |
| coach_reports | id PK; session_id → motion_sessions cascade; model_version, ruleset_version, validation_status, report jsonb, generated_at | unique session/model/ruleset; private owner read; server writes, explicit limitations and origin inherited from session |
| posts | id PK; author_id → profiles; resort_id → resorts nullable; caption, media_path, visibility, created_at | index visibility/created_at and author; author writes; visibility + block-aware reads; media consent/storage policies before shipping |
| post_likes | id PK; post_id → posts cascade; user_id → profiles | unique post/user; can insert/delete own likes only if post readable; no mass actor writes |
| comments | id PK; post_id → posts cascade; author_id → profiles; body, created_at | index post/created_at; author writes within visible posts; block/visibility-aware reads, moderation server-only |

## RLS and grants
Every implemented table has RLS enabled. Anonymous role has no table grants. Authenticated gets narrowly listed grants; policies further scope rows. No insert policy or grant exists for matches, conversations or conversation_members. Security definer functions use `search_path=''` and qualified tables; execute is revoked from public/anon and granted to authenticated. Helpers disclose only booleans relative to the current user. No service role credentials are created or included. No realtime publication is enabled yet.

`supabase/tests/bootstrap.sql` is a local-only facsimile of auth.uid()/roles, never an application migration. Actual Supabase JWT/Auth/Storage/Realtime behavior still needs staging verification after approval. Tests cover positive and negative role cases, block safety, provenance promotion denial and matching idempotence; concurrency and rate-limit/load testing remain future work.

## Retention and deletion
No production retention jobs exist. Proposed defaults for approval: raw sensor chunks 30 days, derived private reports until owner deletion, price observations 90 days subject to licensing, report evidence 90 days subject to legal/moderation requirements. Do not implement these periods silently. Account deletion must revoke sessions, purge private Storage objects and all profile-owned content, then delete auth identity; FK cascades do not delete Storage objects. Export/delete controls and treatment of other participants' messages need explicit product policy before shipping. No real personal data is stored in this Day 1 prototype.
