export type Stance = "Regular" | "Goofy";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type DataOrigin = "synthetic" | "real_unverified" | "real_verified";
export type FeatureStage =
  "ui_prototype" | "demo_functional" | "backend_integrated";
export interface Rider {
  id: string;
  name: string;
  age: number;
  level: SkillLevel;
  stance: Stance;
  resort: string;
  interests: string[];
  bio: string;
}
export interface TicketOffer {
  id: string;
  resort: string;
  visitDate: string;
  ticketType: string;
  amount: number;
  currency: "USD";
  provider: string;
  sourceUrl: string | null;
  lastVerifiedAt: string | null;
  origin: "demo" | "live";
}
