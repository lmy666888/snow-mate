import type { SkillLevel, Stance } from "@snowmate/shared-types";
import {
  cities,
  countries,
  distanceKm,
  type Country,
  type RegionPreferences,
} from "../regions/model";
export interface DemoRider {
  id: string;
  name: string;
  age: number;
  country: Country;
  city: string;
  level: SkillLevel;
  stance: Stance;
  interests: string[];
  resort: string;
  style: string;
  bio: string;
  preference: string;
  avatarColor: string;
  origin: "fictional";
  likesCurrentUser: boolean;
}
const names = [
  "Riley Chen",
  "Jordan Lee",
  "Sam Rivera",
  "Taylor Park",
  "Avery Wilson",
  "Morgan Xu",
  "Casey Bennett",
  "Jamie Wong",
  "Kai Thompson",
  "Skyler Liu",
  "Quinn Martin",
  "Alexis Zhao",
  "Harper Singh",
  "Rowan Kim",
  "Parker Davis",
  "Reese Lin",
  "Sage Laurent",
  "Emerson Wu",
  "Finley Brooks",
  "Remy Zhang",
  "Cameron Li",
  "Blair Foster",
  "Drew Tang",
  "Ellis Cooper",
  "Frankie Sun",
  "Hayden Clarke",
  "Indigo Hu",
  "Jules Wang",
  "Kendall Shaw",
  "Logan Guo",
  "Micah Chen",
  "Nico Young",
  "Oakley Zhou",
  "Peyton Harris",
  "River Huang",
  "Shiloh Reed",
  "Tatum Fang",
  "Valen Scott",
  "Winter Ma",
  "Yuri Allen",
];
const levels: SkillLevel[] = ["Intermediate", "Advanced", "Beginner", "Expert"];
export const interests = [
  "Cruisy runs",
  "Fresh powder",
  "Après coffee",
  "Tree runs",
  "Freestyle",
  "Weekend trips",
  "Learning together",
  "Photography",
];
const resorts: Record<Country, string[]> = {
  US: ["Stowe Mountain", "Sugarbush", "Breckenridge"],
  CA: ["Whistler Blackcomb", "Mont Tremblant", "Blue Mountain"],
  CN: ["Chongli", "Yabuli", "Xiling Snow Mountain"],
};
export const demoRiders: DemoRider[] = names.map((name, i) => {
  const country = countries[i % 3];
  return {
    id: `demo-${String(i + 1).padStart(2, "0")}`,
    name,
    age: 21 + ((i * 7) % 20),
    country,
    city: cities[country][Math.floor(i / 3) % 3],
    level: levels[i % 4],
    stance: i % 2 ? "Regular" : "Goofy",
    interests: [
      interests[i % 8],
      interests[(i + 3) % 8],
      interests[(i + 5) % 8],
    ],
    resort: resorts[country][Math.floor(i / 3) % 3],
    style: ["All mountain", "Freestyle", "Freeride", "Groomers"][
      Math.floor(i / 2) % 4
    ],
    bio: [
      "Early lifts, easy turns, and a coffee with the crew.",
      "Looking for patient riding buddies and a weekend escape.",
      "Always curious about a new line and good mountain company.",
      "Here for fresh snow, shared stories, and one more run.",
    ][i % 4],
    preference: i % 2 ? "Similar level" : "All levels",
    avatarColor: ["#E9CBD8", "#D9D8EC", "#CFE2DA", "#EFD9C3", "#D6E1EF"][i % 5],
    origin: "fictional",
    likesCurrentUser: i % 3 === 0,
  };
});
export interface DiscoveryFilters {
  level: string;
  stance: string;
  interest: string;
}
export interface DiscoveryHistory {
  viewed: string[];
  blocked: string[];
}
export const defaultFilters: DiscoveryFilters = {
  level: "All levels",
  stance: "Any stance",
  interest: "Any interest",
};
/** Demo boundary: replace with JWT-scoped Supabase adapter in M2.0, never infer real matches here. */
export interface DiscoveryRepository {
  list(
    region: RegionPreferences,
    filters: DiscoveryFilters,
    history: DiscoveryHistory,
  ): DemoRider[];
  mutualLike(riderId: string): boolean;
}
export const demoRepository: DiscoveryRepository = {
  list: (region, filters, history) =>
    demoRiders.filter(
      (r) =>
        !history.blocked.includes(r.id) &&
        !history.viewed.includes(r.id) &&
        (region.discovery === "all" || r.country === region.discovery) &&
        distanceKm(region.city, r.city) <= region.maxDistanceKm &&
        (filters.level === "All levels" || r.level === filters.level) &&
        (filters.stance === "Any stance" || r.stance === filters.stance) &&
        (filters.interest === "Any interest" ||
          r.interests.includes(filters.interest)),
    ),
  mutualLike: (id) =>
    demoRiders.find((r) => r.id === id)?.likesCurrentUser === true,
};
export function initials(name: string) {
  return name
    .split(" ")
    .map((v) => v[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
