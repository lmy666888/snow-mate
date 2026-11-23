import { useSocial } from "../../stores/social";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { CalendarDays, ShieldCheck, Ticket } from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
  Badge,
  ChoiceGroup,
  Field,
  InfoRow,
  PageHeader,
  PrototypeNote,
  Row,
  ScreenContainer,
  go,
} from "../../components/ui";
import { colors as c } from "../../theme/tokens";
import { formatOffer, offers } from "./data";
import type { TicketOffer } from "@snowmate/shared-types";
export function PriceCard({ offer }: { offer: TicketOffer }) {
  const language = useSocial((s) => s.language);
  return (
    <AppCard>
      <Row style={{ justifyContent: "space-between" }}>
        <AppText variant="title" style={{ fontSize: 21 }}>
          {offer.resort}
        </AppText>
        <Badge tone="gold">DEMO</Badge>
      </Row>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <ViewCopy offer={offer} />
        <AppText style={{ fontSize: 34, fontWeight: "600", lineHeight: 40 }}>
          {formatOffer(offer.amount, offer.currency, language)}
        </AppText>
      </Row>
      <AppText variant="caption" style={{ color: c.muted }}>
        USD · unverified fictional price · no live source
      </AppText>
      <AppButton
        label={`View ${offer.resort} offer`}
        variant="secondary"
        onPress={() => go(`/prices/offer?id=${offer.id}`)}
      />
    </AppCard>
  );
}
function ViewCopy({ offer }: { offer: TicketOffer }) {
  return (
    <AppText variant="label" style={{ color: c.muted, flex: 1 }}>
      {offer.ticketType}
      {"\n"}
      {offer.provider}
    </AppText>
  );
}
export function PriceComparisonScreen() {
  const [date, setDate] = useState("2027-01-16");
  const [type, setType] = useState("1-day adult");
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="More laps for less."
        subtitle="Lift ticket comparison · design preview"
      />
      <AppCard>
        <Row>
          <ShieldCheck size={24} color={c.gold} />
          <AppText style={{ color: c.gold, flex: 1 }}>
            All prices are fictional demo data.
          </AppText>
        </Row>
        <AppText variant="label" style={{ color: c.muted }}>
          No live pricing provider is connected. No price has been verified.
          These offers cannot be purchased.
        </AppText>
      </AppCard>
      <Field
        label="Visit date · preview control"
        value={date}
        onChangeText={setDate}
      />
      <ChoiceGroup
        label="Ticket type · preview control"
        options={["1-day adult", "2-day adult"]}
        value={type}
        onChange={setType}
      />
      <PrototypeNote>
        Offers below are fixed fixtures for Jan 16, 2027 · Adult 1 day,
        regardless of preview controls.
      </PrototypeNote>
      {offers.map((o) => (
        <PriceCard key={o.id} offer={o} />
      ))}
    </ScreenContainer>
  );
}
export function TicketOfferScreen() {
  const language = useSocial((s) => s.language);
  const { id } = useLocalSearchParams();
  const offer = offers.find((o) => o.id === id) ?? offers[0];
  return (
    <ScreenContainer>
      <PageHeader back title="One good mountain day." subtitle={offer.resort} />
      <AppCard>
        <Ticket size={36} color={c.accent} />
        <Badge tone="gold">FICTIONAL OFFER · DEMO</Badge>
        <AppText variant="display">
          {formatOffer(offer.amount, offer.currency, language)} USD
        </AppText>
        <AppText>{offer.ticketType}</AppText>
        <InfoRow label="Resort" value={offer.resort} />
        <InfoRow
          label="Visit date"
          value={new Intl.DateTimeFormat(language, {
            dateStyle: "medium",
            timeZone: "UTC",
          }).format(new Date(offer.visitDate + "T00:00:00Z"))}
          icon={CalendarDays}
        />
        <InfoRow label="Provider" value={offer.provider} />
        <InfoRow label="Last verified" value="Never · demo fixture" />
        <InfoRow label="Source URL" value="Unavailable · no live source" />
      </AppCard>
      <AppText style={{ color: c.muted }}>
        This price illustrates the comparison experience. Taxes, availability,
        cancellation terms, and current pricing are not available.
      </AppText>
      <AppButton
        label="Booking unavailable in preview"
        disabled
        onPress={() => {}}
      />
      <AppButton
        label="Back to comparison"
        variant="secondary"
        onPress={() => go("/prices/compare")}
      />
    </ScreenContainer>
  );
}
