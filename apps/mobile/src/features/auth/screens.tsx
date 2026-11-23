import React, { useState } from "react";
import { ImageBackground, View } from "react-native";
import { router } from "expo-router";
import { ArrowRight, Camera, Mountain, ShieldCheck } from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
  Badge,
  ChoiceGroup,
  Field,
  IconButton,
  PageHeader,
  PrototypeNote,
  Row,
  ScreenContainer,
  go,
} from "../../components/ui";
import { colors as c } from "../../theme/tokens";
import { images } from "../social/data";
import { usePrototype } from "../../stores/prototype";
export function WelcomeScreen() {
  return (
    <ScreenContainer style={{ padding: 0, gap: 0 }}>
      <ImageBackground
        source={images.mountain}
        imageStyle={{ width: "100%", height: "100%" }}
        style={{ height: 470, justifyContent: "space-between" }}
      >
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#F9D8E518",
          }}
        />
        <Row style={{ padding: 28 }}>
          <Mountain size={27} color={c.text} />
          <AppText
            style={{
              fontFamily: "SnowmateScript",
              fontSize: 44,
              lineHeight: 52,
              color: c.text,
            }}
          >
            Snowmate
          </AppText>
        </Row>
        <View
          style={{
            padding: 28,
            paddingBottom: 32,
            backgroundColor: c.overlay,
            gap: 16,
          }}
        >
          <Badge>MADE FOR MOUNTAIN DAYS</Badge>
          <AppText
            style={{
              fontSize: 49,
              lineHeight: 52,
              letterSpacing: -1.3,
              fontWeight: "500",
            }}
          >
            Find your line.{"\n"}Find your people.
          </AppText>
        </View>
      </ImageBackground>
      <View style={{ padding: 26, gap: 20 }}>
        <AppText style={{ color: c.muted, fontSize: 16, lineHeight: 25 }}>
          Ride together. Plan the escape. Grow with every turn. Your next
          snowboarding story starts here.
        </AppText>
        <AppButton
          label="Find my mountain crew"
          icon={ArrowRight}
          onPress={() => go("/(auth)/sign-in")}
        />
        <AppButton
          label="Explore the demo"
          variant="secondary"
          onPress={() => router.replace("/(tabs)/discover")}
        />
        <PrototypeNote>
          DAY 1 DESIGN PREVIEW · no account required
        </PrototypeNote>
      </View>
    </ScreenContainer>
  );
}
export function SignInScreen() {
  const [signup, setSignup] = useState(false);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title={signup ? "Make it your season." : "Welcome back."}
        subtitle="Your next mountain day is waiting."
      />
      <AppCard>
        <ShieldCheck color={c.accent} size={28} />
        <AppText>Account setup is coming next.</AppText>
        <AppText style={{ color: c.muted }}>
          This is the sign-in design preview. Explore without entering your real
          credentials.
        </AppText>
      </AppCard>
      <Field label="Email preview" placeholder="rider@example.com" />
      <Field
        label="Password preview"
        placeholder="Design preview only"
        secureTextEntry
      />
      <AppButton
        label={signup ? "Preview profile setup" : "Continue to profile preview"}
        onPress={() => go("/(auth)/setup")}
      />
      <AppButton
        label={
          signup
            ? "Already have an account? Sign in"
            : "New here? Create an account"
        }
        variant="ghost"
        onPress={() => setSignup(!signup)}
      />
      <AppButton
        label="Skip to demo"
        variant="secondary"
        onPress={() => router.replace("/(tabs)/discover")}
      />
      <PrototypeNote>
        No authentication request is made and credentials are not stored.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function ProfileSetupScreen() {
  const { name, stance, level, updateProfile, notify } = usePrototype();
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Your mountain self."
        subtitle="01 / 02 · Snowboarding profile"
      />
      <Row>
        <IconButton
          icon={Camera}
          size={72}
          label="Photo upload preview"
          onPress={() =>
            notify(
              "Photo picker is planned after UI approval. Stock photo used in this preview.",
            )
          }
        />
        <AppText variant="label" style={{ color: c.muted }}>
          Add your favorite mountain photo
        </AppText>
      </Row>
      <Field
        label="Display name"
        value={name}
        onChangeText={(name) => updateProfile({ name })}
      />
      <ChoiceGroup
        label="Snowboarding level"
        options={["Beginner", "Intermediate", "Advanced", "Expert"]}
        value={level}
        onChange={(level) => updateProfile({ level })}
      />
      <ChoiceGroup
        label="Stance"
        options={["Regular", "Goofy"]}
        value={stance}
        onChange={(stance) =>
          updateProfile({ stance: stance as "Regular" | "Goofy" })
        }
      />
      <Field label="Favorite resorts" placeholder="Stowe, Sugarbush…" />
      <Field
        label="A little about you"
        multiline
        placeholder="Your perfect mountain day…"
      />
      <AppButton
        label="Next: riding preferences"
        icon={ArrowRight}
        onPress={() => go("/(auth)/preferences")}
      />
      <PrototypeNote>
        Profile changes are temporary and reset when you reload.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function PreferencesScreen() {
  const [style, setStyle] = useState("All mountain");
  const [distance, setDistance] = useState("Weekend escape");
  const [matching, setMatching] = useState("Similar level");
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Ride your way."
        subtitle="02 / 02 · Riding preferences"
      />
      <ChoiceGroup
        label="Preferred riding style"
        options={["All mountain", "Freestyle", "Freeride", "Groomers"]}
        value={style}
        onChange={setStyle}
      />
      <ChoiceGroup
        label="How far will you travel?"
        options={["Day trip", "Weekend escape", "Anywhere for snow"]}
        value={distance}
        onChange={setDistance}
      />
      <ChoiceGroup
        label="Who do you want to ride with?"
        options={["Similar level", "All levels", "Learning together"]}
        value={matching}
        onChange={setMatching}
      />
      <AppCard>
        <AppText variant="title">More turns, together.</AppText>
        <AppText style={{ color: c.muted }}>
          Start with people who share your pace. You can always change your
          preferences later.
        </AppText>
      </AppCard>
      <AppButton
        label="Let’s find your crew"
        icon={ArrowRight}
        onPress={() => router.replace("/(tabs)/discover")}
      />
      <PrototypeNote>
        Preference controls are interactive previews; they do not filter a live
        rider directory.
      </PrototypeNote>
    </ScreenContainer>
  );
}
