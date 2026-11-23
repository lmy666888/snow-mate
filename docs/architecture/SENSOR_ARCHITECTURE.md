# Sensor architecture — contract only before approval

## Existing artifacts and boundary
`packages/sensor-protocol/src/index.ts` exports protocol `1.0.0`, `Vector3`, `MotionSample` and `SensorProvider` connect/start/stop/disconnect/subscribe methods. `packages/shared-types` exports DataOrigin (`synthetic`, `real_unverified`, `real_verified`). Coach views read a fixed hand-authored `chartPoints` fixture, not a provider. No BLE, timers, synthetic generator, recording, calibration, scoring or analysis is implemented at this approval gate.

## Planned provider lifecycle
Idle → connect → ready → start → streaming → stop → ready → disconnect → idle. Errors transition to disconnected/error with explicit user recovery. connect/start/stop/disconnect must be idempotent, subscription removal must stop delivery to that callback, stop must release interval resources, and disconnect must stop streaming and clear device state. Late callbacks after stop/disconnect must be rejected via a stream generation token. UI state must not pretend data collection continues after a disconnect.

MockMotionProvider (after approval) implements the same contract as future BLEMotionProvider. A pure seeded sample function plus injectable clock/scheduler will make tests deterministic. A fixed device ID, monotonically increasing sequence and logical session-relative timestamp will support replay. Planned scenarios: nominal periodic turns, irregular timing/shape, dropped sequences, seeded bounded noise, and an explicit disconnect after a configured sample count. Dropped samples advance logical time and sequence, never compress time or hide a gap. Mock scenario metadata and seed belong in the session manifest. These are design requirements, not current provider behavior.

BLEMotionProvider is a future adapter: discover authorized sensors, negotiate firmware/protocol, decode packets, retain raw device timestamps, align clocks, buffer batches, apply calibration, and emit the same canonical samples. No Day 1 native modules or BLE permissions.

## Version 1 conventions
- Board-fixed right-handed frame: X points toward the nose, Y toward the rider's left when facing the nose, Z away from the base through the top sheet. Stance is a session property and does not silently invert axes.
- Acceleration: m/s², specific force including gravity response. At rest flat with Z up, a calibrated device reports approximately +9.80665 on Z. Gravity-removed values require a separately named derived channel.
- Angular velocity: rad/s, positive by right-hand rule. Derived orientation/roll for chart display may use degrees but must never relabel raw gyro as degrees/s.
- Planned nominal sampling: 50 Hz / 20,000 µs step; actual rates and observed deltas must be recorded. The chart currently has 23 illustrative coordinates, not a 50 Hz data series.
- `timestampUs`: nonnegative integer microseconds relative to monotonic session start; `sequence`: nonnegative integer per-device sample counter. Do not use wall-clock Date.now as the sampling clock. UTC session `started_at` anchors civil time; offsets/uncertainty are separate metadata. JS safe integer range is sufficient for bounded sessions; validate before serialization.
- `deviceId`: opaque local logical identity; raw hardware address is never a public profile field.

## Proposed session/batch envelope
The sample shape stays small. Before provider implementation, define a versioned JSON envelope with protocolVersion, sessionId, origin, provider/scenario/seed, board frame and units, nominalHz, device IDs, calibrationRevision, startedAtUTC, monotonicOriginUs, and quality/synchronization metadata. Origin belongs at the envelope/session level, not scattered across samples. Mixed-origin sessions should be rejected, not inferred from device names. Python services can consume JSON/NDJSON with identical field names and unit conventions; no Python service exists now.

Calibration metadata should include calibration ID/version/time, device placement and orientation quaternion, accelerometer/gyro bias, scale, gravity reference, firmware version and validation state. An absent or expired calibration must remain visible as unverified. Multi-device clock alignment needs offsetUs, driftPpm, lastSyncAt, uncertaintyUs and source clock. Preserve original device time and mapped session time for audit; do not claim synchronized devices until uncertainty is measured.

## Quality and validation
Per-batch indicators: expected/received samples, dropped/duplicate/out-of-order sequences, timestamp jitter, clipping, noise estimate, calibration validity, synchronization uncertainty, battery and connectivity. Thresholds need data-based validation; no demo “98% quality” or technique scores. Real_verified is an explicit trusted analysis/validation promotion, never automatic simply because data came from BLE. Client SQL cannot insert real_verified or update origin.

Post-approval tests must verify seed replay, unit/frame conventions, timestamp/sequence monotonicity with gaps, event ordering, no callbacks after stop, subscription cleanup, all five fault scenarios, reconnect isolation and envelope version compatibility. Future algorithm work requires labeled real snowboard motion and independent evaluation before technique claims.
