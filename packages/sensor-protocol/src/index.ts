/** JSON-compatible contracts only. No simulator, BLE, inference or validation engine in M1.1. */
export const SENSOR_PROTOCOL_VERSION = "1.0.0" as const;
export type DataOrigin = "synthetic" | "real_unverified" | "real_verified";
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}
/** Board frame: +X nose, +Y left facing nose, +Z top sheet; m/s² specific force, rad/s angular velocity. */
export interface MotionSample {
  deviceId: string;
  sequence: number;
  timestampUs: number;
  acceleration: Vector3;
  angularVelocity: Vector3;
}
export interface SensorProvider {
  connect(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(callback: (sample: MotionSample) => void): () => void;
}
export interface CalibrationMetadata {
  id: string;
  revision: string;
  deviceId: string;
  calibratedAtUtc: string;
  firmwareVersion: string;
  placement: string;
  orientationQuaternion: { x: number; y: number; z: number; w: number };
  accelerationBias: Vector3;
  gyroBias: Vector3;
  gravityReferenceMps2: number;
  status: "uncalibrated" | "unverified" | "validated";
}
export interface MotionSession {
  id: string;
  ownerId: string;
  protocolVersion: typeof SENSOR_PROTOCOL_VERSION;
  origin: DataOrigin;
  startedAtUtc: string;
  endedAtUtc: string | null;
  deviceIds: string[];
  nominalHz: number;
  frame: "board_xyz";
  units: { acceleration: "m/s2"; angularVelocity: "rad/s"; time: "us" };
  calibration: CalibrationMetadata[];
  simulation?: { seed: number; scenario: string };
  clock: {
    source: "monotonic";
    offsetUs: number;
    driftPpm: number;
    uncertaintyUs: number;
  };
  quality: {
    expectedSamples: number;
    receivedSamples: number;
    missingSamples: number;
    outOfOrder: number;
    calibrationValid: boolean;
  };
}
export interface MotionEvent {
  id: string;
  sessionId: string;
  origin: DataOrigin;
  timestampUs: number;
  type: "heel_turn" | "toe_turn" | "gap" | "disconnect";
  algorithmVersion: string;
  confidence: number | null;
}
export interface MotionFeatures {
  sessionId: string;
  origin: DataOrigin;
  window: { startUs: number; endUs: number };
  algorithmVersion: string;
  sampleCount: number;
  missingFraction: number;
  rollRangeDeg: number | null;
  angularSpeedRadPerSec: number | null;
  limitations: string[];
}
export interface CoachReport {
  id: string;
  sessionId: string;
  origin: DataOrigin;
  generatedAtUtc: string;
  modelVersion: string;
  algorithmVersion: string;
  validationStatus: "unvalidated" | "research_only" | "validated";
  evidenceEventIds: string[];
  explanation: string;
  recommendations: string[];
  limitations: string[];
}
