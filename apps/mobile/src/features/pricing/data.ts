import type { TicketOffer } from "@snowmate/shared-types";
export const offers: TicketOffer[] = [
  {
    id: "stowe",
    resort: "Stowe Mountain",
    visitDate: "2027-01-16",
    ticketType: "Adult · 1 day",
    amount: 129,
    currency: "USD",
    provider: "Fictional Mountain Direct",
    sourceUrl: null,
    lastVerifiedAt: null,
    origin: "demo",
  },
  {
    id: "sugarbush",
    resort: "Sugarbush",
    visitDate: "2027-01-16",
    ticketType: "Adult · 1 day",
    amount: 109,
    currency: "USD",
    provider: "Fictional Snow Pass",
    sourceUrl: null,
    lastVerifiedAt: null,
    origin: "demo",
  },
  {
    id: "killington",
    resort: "Killington",
    visitDate: "2027-01-16",
    ticketType: "Adult · 1 day",
    amount: 119,
    currency: "USD",
    provider: "Fictional Mountain Direct",
    sourceUrl: null,
    lastVerifiedAt: null,
    origin: "demo",
  },
];
export function formatOffer(
  amount: number,
  currency: string,
  locale = "en-US",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
