import type { SkillLevel, Stance } from "@snowmate/shared-types";
export interface LocalPhoto {
  id: string;
  uri: string;
  mimeType: string;
  bytes: number;
  status: "local";
}
export interface Identity {
  mode: "demo" | "account-preview";
  complete: boolean;
  name: string;
  age: number;
  bio: string;
  level: SkillLevel;
  stance: Stance;
  interests: string[];
  favoriteResorts: string;
  style: string;
  tripPreference: string;
  matching: string;
  photos: LocalPhoto[];
}
export const defaultIdentity: Identity = {
  mode: "demo",
  complete: false,
  name: "Alex Morgan",
  age: 26,
  bio: "Long turns, early coffee, and a good crew.",
  level: "Intermediate",
  stance: "Regular",
  interests: ["Cruisy runs", "Après coffee"],
  favoriteResorts: "Stowe Mountain · Sugarbush",
  style: "All mountain",
  tripPreference: "Weekend escape",
  matching: "Similar level",
  photos: [],
};
export function eligibility(
  identity: Identity,
): "adult-required" | "photo-required" | "onboarding-required" | null {
  if (
    !Number.isInteger(identity.age) ||
    identity.age < 18 ||
    identity.age > 100
  )
    return "adult-required";
  if (!identity.name.trim() || identity.name.length > 60)
    return "onboarding-required";
  if (identity.mode === "account-preview" && identity.photos.length === 0)
    return "photo-required";
  if (identity.mode === "account-preview" && !identity.complete)
    return "onboarding-required";
  return null;
}
export function validatePhoto(bytes: Uint8Array, mime: string): string | null {
  if (bytes.length === 0 || bytes.length > 5 * 1024 * 1024)
    return "Choose an image under 5 MB.";
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const png =
    bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
  const webp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!(
    (mime === "image/jpeg" && jpeg) ||
    (mime === "image/png" && png) ||
    (mime === "image/webp" && webp)
  ))
    return "Choose a valid JPEG, PNG, or WebP image.";
  return null;
}
