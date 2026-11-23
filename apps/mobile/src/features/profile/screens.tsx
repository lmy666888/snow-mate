import React, { useState } from "react";
import { ImageBackground, Switch, View } from "react-native";
import build from "../../generated/build.json";
import { useTranslation } from "react-i18next";
import { Camera, Settings } from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
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
import { useSocial } from "../../stores/social";
import { useStorageError } from "../../services/storage";
import { LocalPhotoView } from "../identity/PhotoManager";
import { images } from "../social/data";
import { initials } from "../social/demoRepository";
export function ProfileScreen() {
  const { identity, region } = useSocial();
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
      <ImageBackground
        source={images.mountain}
        imageStyle={{ width: "100%", height: "100%", borderRadius: 24 }}
        style={{
          height: 170,
          borderRadius: 24,
          overflow: "hidden",
          justifyContent: "flex-end",
        }}
      >
        <View style={{ padding: 16, backgroundColor: c.overlay }}>
          <Badge>
            {identity.mode === "demo"
              ? "FICTIONAL DEMO"
              : "LOCAL ACCOUNT PREVIEW"}
          </Badge>
        </View>
      </ImageBackground>
      <AppCard>
        {identity.photos[0] ? (
          <LocalPhotoView photo={identity.photos[0]} height={210} />
        ) : (
          <View
            style={{
              height: 100,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: c.raised,
              borderRadius: 18,
            }}
          >
            <AppText localize={false} variant="display">
              {initials(identity.name)}
            </AppText>
            <PrototypeNote>Initials placeholder</PrototypeNote>
          </View>
        )}
        <AppText localize={false} variant="display">
          {identity.name}
        </AppText>
        <AppText style={{ color: c.muted }}>
          {region.city} · {region.country}
        </AppText>
        <Row>
          <Badge>{identity.level}</Badge>
          <Badge>{identity.stance}</Badge>
        </Row>
        <AppText localize={false}>{identity.bio}</AppText>
        <Row style={{ flexWrap: "wrap" }}>
          {identity.interests.map((v) => (
            <Badge key={v}>{v}</Badge>
          ))}
        </Row>
        <AppButton
          label="Edit your profile"
          variant="secondary"
          onPress={() => go("/profile/edit")}
        />
        <AppButton
          label="Manage photos"
          icon={Camera}
          variant="ghost"
          onPress={() => go("/profile/photos")}
        />
      </AppCard>
      {identity.photos.length > 1 && (
        <>
          <SectionHeader title="Photo gallery" />
          <Row style={{ flexWrap: "wrap" }}>
            {identity.photos.slice(1).map((photo) => (
              <View key={photo.id} style={{ width: "46%" }}>
                <LocalPhotoView photo={photo} height={120} />
              </View>
            ))}
          </Row>
        </>
      )}
      <SectionHeader title="Riding identity" />
      <AppCard>
        <InfoRow
          label="Favorite resorts"
          localizeValue={false}
          value={identity.favoriteResorts}
        />
        <InfoRow label="Riding style" value={identity.style} />
        <InfoRow label="Trip preferences" value={identity.tripPreference} />
        <InfoRow label="Matching preferences" value={identity.matching} />
      </AppCard>
      <SectionHeader title="Your mountain life" />
      <AppCard>
        <InfoRow
          label="Riding history"
          value="Sample sessions"
          onPress={() => go("/profile/history")}
        />
        <InfoRow
          label="Saved trips"
          onPress={() => go("/profile/saved-trips")}
        />
        <InfoRow
          label="Training sessions"
          value="Synthetic only"
          onPress={() => go("/coach/history")}
        />
        <InfoRow
          label="Community posts"
          value="Fictional samples"
          onPress={() => go("/(tabs)/community")}
        />
        <InfoRow
          label="Privacy and language"
          onPress={() => go("/profile/settings")}
        />
        <InfoRow
          label="Region and units"
          value={region.city}
          onPress={() => go("/profile/region")}
        />
      </AppCard>
      <PrototypeNote>
        Local profile and photos stay on this device. No real account or cloud
        profile exists.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function EditProfileScreen() {
  const { identity, updateIdentity } = useSocial(),
    [draft, setDraft] = useState(identity),
    notify = usePrototype((s) => s.notify);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="A little more you."
        subtitle="Your local riding profile"
      />
      <Field
        label="Display name"
        value={draft.name}
        onChangeText={(name) => setDraft((v) => ({ ...v, name }))}
      />
      <Field
        label="Biography"
        multiline
        value={draft.bio}
        onChangeText={(bio) =>
          setDraft((v) => ({ ...v, bio: bio.slice(0, 500) }))
        }
      />
      <ChoiceGroup
        label="Snowboarding level"
        options={["Beginner", "Intermediate", "Advanced", "Expert"]}
        value={draft.level}
        onChange={(level) =>
          setDraft((v) => ({ ...v, level: level as typeof v.level }))
        }
      />
      <ChoiceGroup
        label="Stance"
        options={["Regular", "Goofy"]}
        value={draft.stance}
        onChange={(stance) =>
          setDraft((v) => ({ ...v, stance: stance as typeof v.stance }))
        }
      />
      <Field
        label="Favorite resorts"
        value={draft.favoriteResorts}
        onChangeText={(favoriteResorts) =>
          setDraft((v) => ({ ...v, favoriteResorts }))
        }
      />
      <AppButton
        label="Save local profile"
        disabled={!draft.name.trim() || draft.name.length > 60}
        onPress={() => {
          updateIdentity({
            name: draft.name.trim(),
            bio: draft.bio,
            level: draft.level,
            stance: draft.stance,
            favoriteResorts: draft.favoriteResorts,
          });
          notify("Profile saved on this device.");
        }}
      />
      <AppButton
        label="Edit interests and preferences"
        variant="secondary"
        onPress={() => go("/identity/onboarding")}
      />
      <AppButton
        label="Manage photos"
        variant="secondary"
        onPress={() => go("/profile/photos")}
      />
    </ScreenContainer>
  );
}
export function SettingsScreen() {
  const { language, setLanguage, region, discoveryVisible, setVisibility } =
      useSocial(),
    { i18n } = useTranslation(),
    error = useStorageError();
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Your space. Your rules."
        subtitle="Device-local settings"
      />
      <AppCard>
        <AppText variant="title">Language</AppText>
        <ChoiceGroup
          label="App language"
          options={["English", "简体中文"]}
          value={language === "zh" ? "简体中文" : "English"}
          onChange={(value) => {
            const next = value === "English" ? "en" : "zh";
            setLanguage(next);
            void i18n.changeLanguage(next);
          }}
        />
        <PrototypeNote>
          Language does not change your region or currency.
        </PrototypeNote>
      </AppCard>
      <AppCard>
        <InfoRow
          label="Region and units"
          value={`${region.city} · ${region.country}`}
          onPress={() => go("/profile/region")}
        />
        <InfoRow label="Manage photos" onPress={() => go("/profile/photos")} />
        <InfoRow
          label="Complete onboarding"
          onPress={() => go("/identity/onboarding")}
        />
      </AppCard>
      <AppCard>
        <AppText variant="title">Privacy, by design.</AppText>
        <Row>
          <AppText style={{ flex: 1 }}>Enable local demo discovery</AppText>
          <Switch
            accessibilityLabel={i18n.t("Enable local demo discovery")}
            value={discoveryVisible}
            onValueChange={setVisibility}
            trackColor={{ true: c.accent, false: c.border }}
          />
        </Row>
        <PrototypeNote>
          Turning this off pauses your local deck. No real public profile or
          motion data is shared.
        </PrototypeNote>
      </AppCard>
      <AppCard>
        <AppText variant="title">{`Snowmate ${build?.milestone ?? "M1.1"} · ${build?.development ? "Development" : "Prototype"}`}</AppText>
        <InfoRow label="Version" value={build?.version ?? "unknown"} />
        <InfoRow label="Git commit" value={build?.sha ?? "unknown"} />
        <InfoRow label="Backend connection" value="Not connected" />
        <InfoRow label="Motion source" value="Synthetic fixture" />
      </AppCard>
      {error && <AppText accessibilityRole="alert">{error}</AppText>}
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
        No real authentication, GPS, photo upload or cloud messages in M1.1.
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
        <AppText>
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
