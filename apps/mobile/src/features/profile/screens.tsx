import React, { useState } from "react";
import { Switch } from "react-native";
import {
  Bookmark,
  History,
  Settings,
  SlidersHorizontal,
} from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
  Avatar,
  Badge,
  ChoiceGroup,
  EmptyState,
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
import { usePrototype } from "../../stores/prototype";
export function ProfileScreen() {
  const { name, stance, level } = usePrototype();
  return (
    <ScreenContainer>
      <PageHeader
        title="Made for the mountain."
        right={
          <IconButton
            icon={Settings}
            label="Settings"
            onPress={() => go("/profile/settings")}
          />
        }
      />
      <AppCard style={{ alignItems: "center", paddingVertical: 28 }}>
        <Avatar size={96} />
        <AppText variant="title">{name || "Your mountain self"}</AppText>
        <AppText variant="label" style={{ color: c.muted }}>
          Boston, MA · fictional demo profile
        </AppText>
        <Row>
          <Badge>{level}</Badge>
          <Badge>{stance} stance</Badge>
        </Row>
        <AppText style={{ color: c.muted, textAlign: "center" }}>
          Long turns, early coffee, and a good crew. Always making room for one
          more run.
        </AppText>
        <AppButton
          label="Edit your profile"
          variant="secondary"
          onPress={() => go("/profile/edit")}
        />
      </AppCard>
      <SectionHeader title="Your mountain life" />
      <AppCard>
        <InfoRow
          label="Riding history"
          value="Sample sessions"
          icon={History}
          onPress={() => go("/profile/history")}
        />
        <InfoRow
          label="Saved escapes"
          value={
            usePrototype((s) => s.savedTrip)
              ? "1 preview trip"
              : "No saved trips"
          }
          icon={Bookmark}
          onPress={() => go("/profile/saved-trips")}
        />
        <InfoRow
          label="Favorite resorts"
          value="Stowe · Sugarbush"
          onPress={() => go("/trips/resort")}
        />
        <InfoRow
          label="Riding preferences"
          icon={SlidersHorizontal}
          onPress={() => go("/(auth)/preferences")}
        />
      </AppCard>
      <Badge tone="gold">DEMO MODE · NO ACCOUNT CONNECTED</Badge>
      <PrototypeNote>
        Profile changes stay in memory until reload. Photos and identity are
        fictional placeholders.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function EditProfileScreen() {
  const { name, stance, level, updateProfile, notify } = usePrototype();
  const [draft, setDraft] = useState({ name, stance, level });
  const [bio, setBio] = useState("Long turns, early coffee, and a good crew.");
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="A little more you."
        subtitle="Profile editor preview"
      />
      <Avatar size={84} />
      <Field
        label="Display name"
        value={draft.name}
        onChangeText={(name) => setDraft((v) => ({ ...v, name }))}
      />
      <ChoiceGroup
        label="Snowboarding level"
        options={["Beginner", "Intermediate", "Advanced", "Expert"]}
        value={draft.level}
        onChange={(level) => setDraft((v) => ({ ...v, level }))}
      />
      <ChoiceGroup
        label="Stance"
        options={["Regular", "Goofy"]}
        value={draft.stance}
        onChange={(stance) =>
          setDraft((v) => ({ ...v, stance: stance as "Regular" | "Goofy" }))
        }
      />
      <Field label="Favorite resorts preview" placeholder="Stowe · Sugarbush" />
      <Field
        label="Biography preview"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <AppButton
        label="Save profile preview"
        onPress={() => {
          updateProfile(draft);
          notify("Name, stance, and level updated until reload.");
        }}
      />
      <PrototypeNote>
        Name, stance, and level update the profile in memory. Biography and
        resort inputs are design controls only.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function SettingsScreen() {
  const [discovery, setDiscovery] = useState(true);
  const [motion, setMotion] = useState(false);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Your space. Your rules."
        subtitle="Settings · visual privacy controls"
      />
      <Badge tone="gold">DEMO MODE</Badge>
      <AppCard>
        <AppText variant="title">Privacy, by design.</AppText>
        <Row style={{ justifyContent: "space-between" }}>
          <AppText style={{ flex: 1 }}>Appear in discovery · preview</AppText>
          <Switch
            accessibilityLabel="Appear in discovery preview"
            value={discovery}
            onValueChange={setDiscovery}
            trackColor={{ true: c.accent, false: c.border }}
          />
        </Row>
        <Row style={{ justifyContent: "space-between" }}>
          <AppText style={{ flex: 1 }}>Share motion summary · preview</AppText>
          <Switch
            accessibilityLabel="Share motion summary preview"
            value={motion}
            onValueChange={setMotion}
            trackColor={{ true: c.accent, false: c.border }}
          />
        </Row>
        <AppText variant="label" style={{ color: c.muted }}>
          These temporary switches illustrate future controls. No profile or
          motion data is being shared.
        </AppText>
      </AppCard>
      <AppCard>
        <InfoRow label="App stage" value="Day 1 UI prototype" />
        <InfoRow label="Backend connection" value="Not configured" />
        <InfoRow label="Motion source" value="Synthetic fixture" />
        <InfoRow label="Account deletion" value="No account exists" />
      </AppCard>
      <AppButton
        label="Review onboarding again"
        variant="secondary"
        onPress={() => go("/(auth)/welcome")}
      />
      <AppButton
        label="Component & state gallery"
        variant="ghost"
        onPress={() => go("/profile/components")}
      />
      <PrototypeNote>
        No location permission, sensor access, analytics, or real account is
        used in this prototype.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function RidingHistoryScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Days to remember."
        subtitle="Your snowboarding journey · sample history"
      />
      <HeroCard
        title="A Stowe kind of morning."
        subtitle="Sample mountain day · no real location recorded"
      />
      <AppCard>
        <AppText variant="title">Every day adds a chapter.</AppText>
        <AppText style={{ color: c.muted }}>
          Your future history will bring together saved trips and private motion
          sessions. This sample is for visual review.
        </AppText>
        <AppButton
          label="Explore sample sessions"
          variant="secondary"
          onPress={() => go("/coach/history")}
        />
      </AppCard>
    </ScreenContainer>
  );
}
export function SavedTripsScreen() {
  const saved = usePrototype((s) => s.savedTrip);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Keep a little escape."
        subtitle="Saved trips · temporary preview"
      />
      {saved ? (
        <HeroCard
          title="The Stowe escape"
          subtitle="Jan 16–18, 2027 · fictional saved trip"
          onPress={() => go("/trips/detail")}
        />
      ) : (
        <EmptyState
          title="Your next escape goes here."
          message="Save a sample itinerary and come back to it while you explore the prototype."
          action="Explore a sample trip"
          onPress={() => go("/trips/detail")}
        />
      )}
    </ScreenContainer>
  );
}
