/** Contract only. Provider implementation is gated on UI approval. SI units; board frame. */
export const SENSOR_PROTOCOL_VERSION = "1.0.0" as const;
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}
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
