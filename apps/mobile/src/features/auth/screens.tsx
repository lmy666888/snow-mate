import React from "react";
import { ImageBackground, View } from "react-native";
import { router } from "expo-router";
import { ArrowRight, Mountain } from "lucide-react-native";
import {
  AppButton,
  AppText,
  Badge,
  PrototypeNote,
  Row,
  ScreenContainer,
  go,
} from "../../components/ui";
import { colors as c } from "../../theme/tokens";
import { useSocial } from "../../stores/social";
import { images } from "../social/data";
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
          onPress={() => go("/identity/onboarding")}
        />
        <AppButton
          label="Explore the demo"
          variant="secondary"
          onPress={() => {
            useSocial.getState().updateIdentity({ mode: "demo", age: 26 });
            router.replace("/(tabs)/discover");
          }}
        />
        <PrototypeNote>
          DAY 1 DESIGN PREVIEW · no account required
        </PrototypeNote>
      </View>
    </ScreenContainer>
  );
}
