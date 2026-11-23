import { useSocial } from "../../stores/social";
import { formatMoney } from "../regions/model";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, Share, View } from "react-native";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  MapPin,
  Mountain,
  SlidersHorizontal,
  Sparkles,
  Ticket,
} from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
  Avatar,
  Badge,
  BottomSheet,
  ChoiceGroup,
  Field,
  HeroCard,
  IconButton,
  InfoRow,
  PageHeader,
  PrototypeNote,
  Row,
  ScreenContainer,
  SectionHeader,
  go,
} from "../../components/ui";
import { colors as c } from "../../theme/tokens";
import { images } from "../social/data";
import { usePrototype } from "../../stores/prototype";
export function TripsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Chase the next day."
        subtitle="A little less planning. A lot more riding."
        right={
          <IconButton
            icon={Bookmark}
            label="Saved trips"
            onPress={() => go("/profile/saved-trips")}
          />
        }
      />
      <HeroCard
        title="A weekend above it all."
        subtitle="Stowe, Vermont · Jan 16–18, 2027"
        tag="YOUR NEXT ESCAPE · DEMO"
        height={260}
        onPress={() => go("/trips/detail")}
      />
      <AppButton
        label="Plan a mountain escape"
        icon={Sparkles}
        onPress={() => go("/trips/planner")}
      />
      <Row style={{ justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <AppText variant="title">More mountain. Less spend.</AppText>
          <AppText variant="label" style={{ color: c.muted, marginTop: 6 }}>
            Compare illustrative lift ticket offers.
          </AppText>
        </View>
        <IconButton
          icon={Ticket}
          label="Compare ticket prices"
          onPress={() => go("/prices/compare")}
        />
      </Row>
      <SectionHeader
        title="Mountains on your radar"
        action="Explore"
        onPress={() => go("/trips/resort")}
      />
      <HeroCard
        title="Stowe Mountain"
        subtitle="Vermont · A classic mountain escape"
        height={155}
        onPress={() => go("/trips/resort")}
      />
      <HeroCard
        title="Sugarbush"
        subtitle="Vermont · Find a different line"
        image={images.forest}
        height={155}
        onPress={() => go("/trips/resort?resort=Sugarbush")}
      />
      <PrototypeNote>
        Trips and resort descriptions are sample content. No live conditions or
        booking availability.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function TripPlannerScreen() {
  const { region, language } = useSocial();
  const [fields, setFields] = useState({
    start: "Boston, MA",
    destination: "Vermont mountains",
    dates: "Jan 16–18, 2027",
    budget: "600",
    group: "3",
    requests: "Cruisy runs, a cozy cabin, and good coffee.",
  });
  const [level, setLevel] = useState("Intermediate");
  const [transport, setTransport] = useState("Drive");
  const [stay, setStay] = useState("Cabin");
  const set = (key: keyof typeof fields) => (value: string) =>
    setFields((f) => ({ ...f, [key]: value }));
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Make room for snow."
        subtitle="Your trip, with a little inspiration."
      />
      <Row>
        <Badge>PLANNER PREVIEW</Badge>
        <AppText variant="label" style={{ color: c.muted }}>
          No AI request will be made
        </AppText>
      </Row>
      <Field
        label="Starting location"
        value={fields.start}
        onChangeText={set("start")}
      />
      <Field
        label="Destination preference"
        value={fields.destination}
        onChangeText={set("destination")}
      />
      <Field
        label="Travel dates · text preview"
        value={fields.dates}
        onChangeText={set("dates")}
      />
      <Row>
        <View style={{ flex: 1 }}>
          <Field
            label={`Budget / person · ${region.currency}`}
            value={fields.budget}
            onChangeText={set("budget")}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Field
            label="Group size"
            value={fields.group}
            onChangeText={set("group")}
            keyboardType="numeric"
          />
        </View>
      </Row>
      <AppText>
        {formatMoney(Number(fields.budget) || 0, region.currency, language)}
      </AppText>
      <ChoiceGroup
        label="Skill level"
        options={["Beginner", "Intermediate", "Advanced", "Expert"]}
        value={level}
        onChange={setLevel}
      />
      <ChoiceGroup
        label="Getting there"
        options={["Drive", "Carpool", "Train"]}
        value={transport}
        onChange={setTransport}
      />
      <ChoiceGroup
        label="Stay your way"
        options={["Cabin", "Hotel", "Day trip"]}
        value={stay}
        onChange={setStay}
      />
      <Field
        label="Anything else on your wishlist?"
        multiline
        value={fields.requests}
        onChangeText={set("requests")}
      />
      <AppButton
        label="Preview sample itinerary"
        icon={Sparkles}
        onPress={() => go("/trips/results")}
      />
      <PrototypeNote>
        Inputs are temporary UI state. Results show a fixed fictional trip,
        independent of your entries. Validation, calendar, persistence, and AI
        generation follow approval.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function TripResultsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Your weekend, imagined."
        subtitle="A fixed sample itinerary · not AI generated"
      />
      <HeroCard
        title="Three days. Fresh perspective."
        subtitle="Stowe · Jan 16–18, 2027 · 3 riders"
        tag="FICTIONAL TRIP"
      />
      <AppCard>
        <Row>
          <Sparkles color={c.accent} size={22} />
          <AppText variant="title">A slower kind of escape.</AppText>
        </Row>
        <AppText style={{ color: c.muted }}>
          Groomer laps, a cabin in the trees, and time to linger over coffee. A
          sample plan for intermediate riders.
        </AppText>
        <Row>
          <Badge>Drive</Badge>
          <Badge>Cabin</Badge>
          <Badge>Intermediate</Badge>
        </Row>
      </AppCard>
      <AppButton
        label="Explore the itinerary"
        icon={ArrowRight}
        onPress={() => go("/trips/detail")}
      />
      <AppButton
        label="Adjust your preferences"
        variant="secondary"
        onPress={() => go("/trips/planner")}
      />
      <BudgetCard />
    </ScreenContainer>
  );
}
const activities = [
  {
    time: "07:00",
    title: "Coffee & the open road",
    detail: "Leave Boston together · sample drive plan",
  },
  {
    time: "11:00",
    title: "Find your first line",
    detail: "Meet at the base · warm up on an easy run",
  },
  {
    time: "13:00",
    title: "A well-earned lunch",
    detail: "Base lodge · leave time to recharge",
  },
  {
    time: "16:30",
    title: "Cabin, cocoa, repeat",
    detail: "Check in · plan tomorrow’s mountain day",
  },
];
export function BudgetCard() {
  return (
    <AppCard>
      <Row style={{ justifyContent: "space-between" }}>
        <AppText variant="title">Room in the budget.</AppText>
        <Badge tone="gold">ESTIMATES</Badge>
      </Row>
      {[
        ["Lift ticket", "$129"],
        ["Cabin · 2 nights", "$220"],
        ["Transport", "$65"],
        ["Food & coffee", "$90"],
      ].map(([label, value]) => (
        <Row key={label} style={{ justifyContent: "space-between" }}>
          <AppText style={{ color: c.muted }}>{label}</AppText>
          <AppText>{value}</AppText>
        </Row>
      ))}
      <View style={{ height: 1, backgroundColor: c.border }} />
      <Row style={{ justifyContent: "space-between" }}>
        <AppText>Sample total / person</AppText>
        <AppText variant="title">$504</AppText>
      </Row>
      <PrototypeNote>
        Fictional USD estimates. Not quotes, live prices, or reservations.
      </PrototypeNote>
    </AppCard>
  );
}
export function TripDetailScreen() {
  const { savedTrip, toggleTrip, notify } = usePrototype();
  const [day, setDay] = useState("Day 1");
  const [edit, setEdit] = useState<number | null>(null);
  const [items, setItems] = useState(activities);
  const [draft, setDraft] = useState("");
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="The Stowe escape."
        subtitle="Jan 16–18, 2027 · fictional sample trip"
      />
      <HeroCard
        title="Mountain time, together."
        subtitle="3 days · 3 riders · cabin stay"
        height={185}
      />
      <Row>
        <AppButton
          style={{ flex: 1 }}
          label={savedTrip ? "Saved in preview" : "Save this trip"}
          icon={savedTrip ? Check : Bookmark}
          onPress={toggleTrip}
        />
        <IconButton
          icon={ArrowUpRight}
          label="Share sample trip"
          onPress={() => {
            void Share.share({
              message:
                "The Stowe escape — fictional Snowmate UI preview. Not a booking.",
            });
          }}
        />
      </Row>
      <Row>
        <Avatar size={33} />
        <AppText variant="label" style={{ color: c.muted }}>
          You, Riley & Jordan · sample crew
        </AppText>
      </Row>
      <ChoiceGroup
        label="Your itinerary"
        options={["Day 1", "Day 2", "Day 3"]}
        value={day}
        onChange={setDay}
      />
      <PrototypeNote>
        {day} shows the same editable fixture for layout review.
      </PrototypeNote>
      {items.map((a, i) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${a.title}`}
          key={a.time}
          onPress={() => {
            setDraft(a.title);
            setEdit(i);
          }}
        >
          <Row style={{ alignItems: "flex-start" }}>
            <View style={{ width: 47, paddingTop: 3 }}>
              <AppText variant="label" style={{ color: c.accent }}>
                {a.time}
              </AppText>
              <View
                style={{
                  width: 1,
                  height: 46,
                  backgroundColor: c.border,
                  marginTop: 12,
                  marginLeft: 15,
                }}
              />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <AppText style={{ fontWeight: "600" }}>{a.title}</AppText>
              <AppText variant="label" style={{ color: c.muted }}>
                {a.detail}
              </AppText>
            </View>
            <SlidersHorizontal size={15} color={c.muted} />
          </Row>
        </Pressable>
      ))}
      <BudgetCard />
      <AppButton
        label="Explore Stowe Mountain"
        variant="secondary"
        icon={Mountain}
        onPress={() => go("/trips/resort")}
      />
      <BottomSheet
        visible={edit !== null}
        title="A little change of plan"
        onClose={() => setEdit(null)}
      >
        <Field label="Activity title" value={draft} onChangeText={setDraft} />
        <AppButton
          label="Save preview edit"
          onPress={() => {
            setItems((v) =>
              v.map((a, i) => (i === edit ? { ...a, title: draft } : a)),
            );
            setEdit(null);
            notify("Activity updated in this temporary preview.");
          }}
        />
      </BottomSheet>
    </ScreenContainer>
  );
}
export function ResortDetailScreen() {
  const { resort } = useLocalSearchParams<{ resort?: string }>();
  const name = resort === "Sugarbush" ? "Sugarbush" : "Stowe Mountain";
  return (
    <ScreenContainer>
      <PageHeader
        back
        title={`${name}.`}
        subtitle="Vermont, Northeast US · resort preview"
      />
      <HeroCard
        title="A New England classic."
        subtitle="Mountain scenery · stock placeholder photography"
        height={250}
      />
      <Row style={{ flexWrap: "wrap" }}>
        <Badge>All mountain</Badge>
        <Badge>Snowboarding</Badge>
        <Badge tone="gold">SAMPLE CONTENT</Badge>
      </Row>
      <AppText variant="title">Stay for another run.</AppText>
      <AppText style={{ color: c.muted }}>
        Imagine long groomers, mountain views, and a welcoming base village.
        This editorial preview is not a conditions report. Confirm trail access,
        weather, and ability requirements with the resort.
      </AppText>
      <AppCard>
        <InfoRow label="Mountain conditions" value="Not connected" />
        <InfoRow label="Trail & lift status" value="Not connected" />
        <InfoRow label="Resort location" value="Vermont, US" icon={MapPin} />
      </AppCard>
      <AppButton
        label="Compare sample tickets"
        icon={Ticket}
        onPress={() => go("/prices/compare")}
      />
      <AppButton
        label="Build a trip around it"
        variant="secondary"
        onPress={() => go("/trips/planner")}
      />
    </ScreenContainer>
  );
}
