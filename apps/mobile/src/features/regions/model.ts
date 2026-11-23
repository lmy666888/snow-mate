export type Country = "US" | "CA" | "CN";
export interface RegionPreferences {
  country: Country;
  city: string;
  discovery: Country | "all";
  maxDistanceKm: number;
  distanceUnit: "km" | "mi";
  temperatureUnit: "C" | "F";
  currency: "USD" | "CAD" | "CNY";
}
export const countries: Country[] = ["US", "CA", "CN"];
export const cities: Record<Country, string[]> = {
  US: ["Boston", "Denver", "Seattle"],
  CA: ["Vancouver", "Toronto", "Montreal"],
  CN: ["Beijing", "Shanghai", "Chengdu"],
};
// Coarse city centers only, never user GPS or street locations.
const coordinates: Record<string, [number, number]> = {
  Boston: [42.36, -71.06],
  Denver: [39.74, -104.99],
  Seattle: [47.61, -122.33],
  Vancouver: [49.28, -123.12],
  Toronto: [43.65, -79.38],
  Montreal: [45.5, -73.57],
  Beijing: [39.9, 116.41],
  Shanghai: [31.23, 121.47],
  Chengdu: [30.57, 104.07],
};
export const defaultRegion: RegionPreferences = {
  country: "US",
  city: "Boston",
  discovery: "all",
  maxDistanceKm: 20000,
  distanceUnit: "km",
  temperatureUnit: "C",
  currency: "USD",
};
export function distanceKm(a: string, b: string): number {
  const first = coordinates[a],
    second = coordinates[b];
  if (!first || !second) return Infinity;
  const rad = (n: number) => (n * Math.PI) / 180;
  const dLat = rad(second[0] - first[0]),
    dLon = rad(second[1] - first[1]);
  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(first[0])) *
      Math.cos(rad(second[0])) *
      Math.sin(dLon / 2) ** 2;
  return (
    6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(Math.max(0, 1 - value)))
  );
}
export const displayDistance = (
  km: number,
  unit: "km" | "mi",
  locale: string,
) =>
  `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(unit === "mi" ? km / 1.609344 : km)} ${unit}`;
export const formatMoney = (amount: number, currency: string, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
