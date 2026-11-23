import {
  defaultIdentity,
  type Identity,
  type LocalPhoto,
} from "../identity/model";
import {
  cities,
  countries,
  defaultRegion,
  type RegionPreferences,
} from "../regions/model";
import {
  defaultFilters,
  demoRiders,
  demoRepository,
  type DiscoveryFilters,
} from "./demoRepository";
import type { ChatMessage } from "./logic";
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const text = (v: unknown, fallback: string, max = 500) =>
  typeof v === "string" ? v.slice(0, max) : fallback;
function select<T extends string>(
  value: unknown,
  options: readonly T[],
  fallback: T,
): T {
  return options.includes(value as T) ? (value as T) : fallback;
}
const list = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string").slice(0, 40)
    : [];
const validIds = (value: unknown) => [
  ...new Set(list(value).filter((id) => demoRiders.some((r) => r.id === id))),
];
export function normalizePersisted(value: unknown) {
  const s = record(value),
    r = record(s.region),
    p = record(s.identity),
    f = record(s.filters);
  const country = select(r.country, countries, defaultRegion.country);
  const region: RegionPreferences = {
    country,
    city: select(r.city, cities[country], cities[country][0]),
    discovery: select(r.discovery, ["all", ...countries], "all"),
    maxDistanceKm:
      typeof r.maxDistanceKm === "number" && Number.isFinite(r.maxDistanceKm)
        ? Math.max(0, Math.min(20000, r.maxDistanceKm))
        : 20000,
    distanceUnit: select(r.distanceUnit, ["km", "mi"], "km"),
    temperatureUnit: select(r.temperatureUnit, ["C", "F"], "C"),
    currency: select(r.currency, ["USD", "CAD", "CNY"], "USD"),
  };
  const photos: LocalPhoto[] = Array.isArray(p.photos)
    ? p.photos.slice(0, 6).filter((photo): photo is LocalPhoto => {
        const v = record(photo);
        return (
          typeof v.id === "string" &&
          /^photo-[a-z0-9-]+$/i.test(v.id) &&
          typeof v.uri === "string" &&
          /^(blob:|file:)/.test(v.uri) &&
          ["image/jpeg", "image/png", "image/webp"].includes(
            String(v.mimeType),
          ) &&
          typeof v.bytes === "number" &&
          v.bytes > 0 &&
          v.bytes <= 5 * 1024 * 1024 &&
          v.status === "local"
        );
      })
    : [];
  const identity: Identity = {
    ...defaultIdentity,
    mode: select(p.mode, ["demo", "account-preview"], "demo"),
    complete: p.complete === true,
    name: text(p.name, defaultIdentity.name, 60),
    age:
      typeof p.age === "number" && Number.isInteger(p.age)
        ? p.age
        : Object.hasOwn(p, "age")
          ? 0
          : defaultIdentity.age,
    bio: text(p.bio, defaultIdentity.bio),
    level: select(
      p.level,
      ["Beginner", "Intermediate", "Advanced", "Expert"],
      "Intermediate",
    ),
    stance: select(p.stance, ["Regular", "Goofy"], "Regular"),
    interests: list(p.interests).slice(0, 8),
    favoriteResorts: text(p.favoriteResorts, defaultIdentity.favoriteResorts),
    style: text(p.style, defaultIdentity.style, 60),
    tripPreference: text(p.tripPreference, defaultIdentity.tripPreference, 60),
    matching: text(p.matching, defaultIdentity.matching, 60),
    photos,
  };
  if (!("interests" in p)) identity.interests = defaultIdentity.interests;
  const filters: DiscoveryFilters = {
    level: select(
      f.level,
      ["All levels", "Beginner", "Intermediate", "Advanced", "Expert"],
      "All levels",
    ),
    stance: select(f.stance, ["Any stance", "Regular", "Goofy"], "Any stance"),
    interest:
      typeof f.interest === "string" ? f.interest : defaultFilters.interest,
  };
  const blocked = validIds(s.blocked),
    matches = validIds(s.matches).filter(
      (id) => demoRepository.mutualLike(id) && !blocked.includes(id),
    );
  const chats: Record<string, ChatMessage[]> = {};
  for (const id of matches) {
    const messages = record(s.chats)[id];
    chats[id] = Array.isArray(messages)
      ? messages.slice(-500).filter((m): m is ChatMessage => {
          const v = record(m);
          return (
            typeof v.id === "string" &&
            typeof v.body === "string" &&
            v.body.length <= 2000 &&
            (v.author === "you" || v.author === "rider")
          );
        })
      : [];
  }
  return {
    language: s.language === "zh" ? ("zh" as const) : ("en" as const),
    region,
    identity,
    filters,
    viewed: validIds(s.viewed),
    likes: validIds(s.likes),
    matches,
    blocked,
    chats,
    lastSwipe: null,
    discoveryVisible: s.discoveryVisible !== false,
  };
}
