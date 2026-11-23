import React, { useCallback, useMemo, useState } from "react";
import {
  Animated,
  ImageBackground,
  PanResponder,
  Pressable,
  View,
  Share,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  ArrowUpRight,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
  Avatar,
  Badge,
  BottomSheet,
  Chip,
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
import { images, riders } from "./data";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { usePrototype } from "../../stores/prototype";
export function DiscoverScreen() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [filters, setFilters] = useState(false);
  const [level, setLevel] = useState("All levels");
  const [position] = useState(() => new Animated.ValueXY());
  const [decision, setDecision] = useState("");
  const rider = riders[index % riders.length];
  const move = useCallback(
    (like: boolean) => {
      setDecision(like ? "LIKE" : "PASS");
      Animated.timing(position, {
        toValue: { x: like ? 450 : -450, y: 10 },
        duration: reduced ? 0 : 220,
        useNativeDriver: true,
      }).start(() => {
        position.setValue({ x: 0, y: 0 });
        setDecision("");
        setIndex((i) => i + 1);
        if (like) go("/discover/match");
      });
    },
    [position, reduced],
  );
  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => {
          position.setValue({ x: g.dx, y: g.dy * 0.12 });
          setDecision(g.dx > 35 ? "LIKE" : g.dx < -35 ? "PASS" : "");
        },
        onPanResponderRelease: (_, g) => {
          if (Math.abs(g.dx) > 100) move(g.dx > 0);
          else {
            setDecision("");
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [position, move],
  );
  return (
    <ScreenContainer>
      <PageHeader
        title="Find your people."
        subtitle="Good turns. Even better company."
        right={
          <IconButton
            icon={MessageCircle}
            label="Matches and messages"
            onPress={() => go("/discover/matches")}
          />
        }
      />
      <Row style={{ justifyContent: "space-between" }}>
        <Row>
          <MapPin size={14} color={c.accent} />
          <AppText variant="label" style={{ color: c.muted }}>
            NORTHEAST, US
          </AppText>
          <Badge>DEMO</Badge>
        </Row>
        <IconButton
          icon={SlidersHorizontal}
          label="Discovery preferences"
          onPress={() => setFilters(true)}
        />
      </Row>
      <View style={{ paddingHorizontal: 1 }}>
        <View
          style={{
            position: "absolute",
            backgroundColor: c.raised,
            top: 12,
            left: 12,
            right: 12,
            bottom: -8,
            borderRadius: 25,
          }}
        />
        <Animated.View
          {...responder.panHandlers}
          style={{
            transform: [
              ...position.getTranslateTransform(),
              {
                rotate: reduced
                  ? "0deg"
                  : position.x.interpolate({
                      inputRange: [-250, 0, 250],
                      outputRange: ["-12deg", "0deg", "12deg"],
                    }),
              },
            ],
          }}
        >
          <ImageBackground
            source={images.rider}
            accessibilityLabel="Stock rider photo representing a fictional demo profile"
            imageStyle={{ borderRadius: 24, width: "100%", height: "100%" }}
            style={{
              minHeight: 380,
              borderRadius: 24,
              overflow: "hidden",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#F4DBE810",
              }}
            />
            <Row style={{ padding: 18, justifyContent: "space-between" }}>
              <Badge tone="green">OPEN TO RIDING</Badge>
              <IconButton
                icon={Info}
                label="Rider profile details"
                onPress={() => go(`/discover/rider?id=${rider.id}`)}
              />
            </Row>
            {!!decision && (
              <View
                style={{
                  position: "absolute",
                  top: 94,
                  left: 20,
                  borderWidth: 3,
                  borderColor: decision === "LIKE" ? c.green : c.coral,
                  padding: 12,
                  borderRadius: 10,
                  transform: [{ rotate: "-12deg" }],
                }}
              >
                <AppText variant="title">{decision}</AppText>
              </View>
            )}
            <View
              style={{
                padding: 22,
                paddingTop: 28,
                backgroundColor: c.overlay,
                gap: 10,
              }}
            >
              <Row style={{ justifyContent: "space-between" }}>
                <AppText variant="display">
                  {rider.name}, {rider.age}
                </AppText>
                <ArrowUpRight color={c.accent} size={24} />
              </Row>
              <Row>
                <Badge>{rider.level}</Badge>
                <AppText variant="label">{rider.stance} stance</AppText>
              </Row>
              <Row>
                <MapPin color={c.accent} size={14} />
                <AppText variant="label">
                  {rider.resort} · fictional profile
                </AppText>
              </Row>
              <Row style={{ flexWrap: "wrap", gap: 7 }}>
                {rider.interests.map((v) => (
                  <AppText
                    key={v}
                    variant="caption"
                    style={{
                      color: c.text,
                      borderWidth: 1,
                      borderColor: c.border,
                      borderRadius: 30,
                      paddingHorizontal: 9,
                      paddingVertical: 5,
                    }}
                  >
                    {v}
                  </AppText>
                ))}
              </Row>
            </View>
          </ImageBackground>
        </Animated.View>
      </View>
      <Row style={{ justifyContent: "center", gap: 28, marginTop: 5 }}>
        <IconButton
          icon={X}
          size={62}
          label="Pass rider"
          onPress={() => move(false)}
        />
        <IconButton
          icon={RotateCcw}
          label="Reset preview cards"
          onPress={() => setIndex(0)}
        />
        <IconButton
          icon={Heart}
          size={62}
          accent
          label="Like rider and preview match"
          onPress={() => move(true)}
        />
      </Row>
      <AppText
        variant="caption"
        style={{ color: c.muted, textAlign: "center" }}
      >
        A shared mountain is a pretty good start.
      </AppText>
      <PrototypeNote>
        Fictional riders · swipe animation preview · likes open a sample match
      </PrototypeNote>
      <BottomSheet
        visible={filters}
        title="Your kind of riding"
        onClose={() => setFilters(false)}
      >
        <ChoiceGroup
          label="Skill level"
          options={["All levels", "Beginner", "Intermediate", "Advanced"]}
          value={level}
          onChange={setLevel}
        />
        <AppText style={{ color: c.muted }}>
          Preferences are a visual preview. The fictional card deck is
          unchanged.
        </AppText>
        <AppButton label="Done" onPress={() => setFilters(false)} />
      </BottomSheet>
    </ScreenContainer>
  );
}
export function RiderDetailScreen() {
  const { id } = useLocalSearchParams();
  const rider = riders.find((v) => v.id === id) ?? riders[0];
  const notify = usePrototype((s) => s.notify);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title={`Meet ${rider.name}.`}
        subtitle="Fictional demo rider"
      />
      <ImageBackground
        source={images.rider}
        style={{ height: 320 }}
        imageStyle={{ borderRadius: 24, width: "100%", height: "100%" }}
      />
      <Row>
        <Badge>{rider.level}</Badge>
        <Badge>{rider.stance}</Badge>
      </Row>
      <AppText variant="title">Here for the good days.</AppText>
      <AppText style={{ color: c.muted }}>{rider.bio}</AppText>
      <AppCard>
        <AppText variant="label" style={{ color: c.accent }}>
          HOME MOUNTAIN
        </AppText>
        <AppText variant="title">{rider.resort}</AppText>
        <Row style={{ flexWrap: "wrap" }}>
          {rider.interests.map((v) => (
            <Chip key={v} label={v} />
          ))}
        </Row>
      </AppCard>
      <AppButton
        label="Preview a match"
        icon={Heart}
        onPress={() => go("/discover/match")}
      />
      <Row>
        <AppButton
          label="Block preview"
          variant="ghost"
          onPress={() =>
            notify("Block control preview. No real account was blocked.")
          }
        />
        <AppButton
          label="Report preview"
          variant="ghost"
          onPress={() => notify("Report flow planned after UI approval.")}
        />
      </Row>
    </ScreenContainer>
  );
}
export function MatchScreen() {
  return (
    <ScreenContainer style={{ paddingTop: 38, gap: 30 }}>
      <Badge tone="green">SAMPLE MATCH · UI PREVIEW</Badge>
      <AppText
        style={{
          fontSize: 48,
          lineHeight: 54,
          fontWeight: "600",
          letterSpacing: -2,
        }}
      >
        Same mountain.{"\n"}New connection.
      </AppText>
      <View
        style={{ height: 200, alignItems: "center", justifyContent: "center" }}
      >
        <View
          style={{
            width: 180,
            height: 180,
            borderRadius: 90,
            borderWidth: 1,
            borderColor: c.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Row style={{ gap: 0 }}>
            <Avatar size={90} />
            <View style={{ marginLeft: -18 }}>
              <Avatar size={90} />
            </View>
          </Row>
          <View
            style={{
              position: "absolute",
              bottom: -10,
              backgroundColor: c.accent,
              padding: 14,
              borderRadius: 40,
            }}
          >
            <Heart color={c.ink} size={24} />
          </View>
        </View>
      </View>
      <AppText variant="title" style={{ textAlign: "center" }}>
        You & Riley
      </AppText>
      <AppText style={{ color: c.muted, textAlign: "center" }}>
        A first chair is better with a friend. Say hello and plan a mountain
        day.
      </AppText>
      <AppButton
        label="Say hello"
        icon={MessageCircle}
        onPress={() => go("/discover/chat")}
      />
      <AppButton
        label="Keep exploring"
        variant="secondary"
        onPress={() => go("/(tabs)/discover")}
      />
      <PrototypeNote>
        This sample illustrates the match celebration. No mutual-like
        transaction has run.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function MatchesScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Your mountain crew."
        subtitle="Demo connections · no real messages"
      />
      <AppText variant="label" style={{ color: c.accent }}>
        NEW CONNECTIONS
      </AppText>
      <Row>
        {riders.map((r) => (
          <Pressable
            key={r.id}
            accessibilityRole="button"
            accessibilityLabel={`Chat with ${r.name}`}
            onPress={() => go("/discover/chat")}
            style={{ gap: 9, alignItems: "center", marginRight: 12 }}
          >
            <Avatar size={65} />
            <AppText variant="label">{r.name}</AppText>
          </Pressable>
        ))}
      </Row>
      <AppText variant="title">Conversations</AppText>
      {riders.slice(0, 2).map((r, i) => (
        <Pressable
          accessibilityRole="button"
          key={r.id}
          onPress={() => go("/discover/chat")}
        >
          <AppCard>
            <Row>
              <Avatar />
              <View style={{ flex: 1, gap: 4 }}>
                <Row style={{ justifyContent: "space-between" }}>
                  <AppText style={{ fontWeight: "600" }}>{r.name}</AppText>
                  <AppText variant="caption" style={{ color: c.muted }}>
                    DEMO
                  </AppText>
                </Row>
                <AppText variant="label" style={{ color: c.muted }}>
                  {i ? "Coffee before first chair?" : "Up for a Stowe weekend?"}
                </AppText>
              </View>
            </Row>
          </AppCard>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}
export function ChatScreen() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    "Hey! Up for a Stowe weekend?",
    "Absolutely. Cruisy runs and coffee?",
  ]);
  return (
    <ScreenContainer>
      <PageHeader back title="Riley" subtitle="Fictional demo conversation" />
      <AppCard>
        <Row>
          <Avatar />
          <View>
            <AppText>Riding at Stowe</AppText>
            <AppText variant="label" style={{ color: c.muted }}>
              Intermediate · Goofy
            </AppText>
          </View>
        </Row>
      </AppCard>
      <AppText
        variant="caption"
        style={{ color: c.muted, textAlign: "center" }}
      >
        SAMPLE CONVERSATION
      </AppText>
      {messages.map((m, i) => (
        <View
          key={`${i}-${m}`}
          style={{
            alignSelf: i % 2 ? "flex-end" : "flex-start",
            backgroundColor: i % 2 ? c.raised : c.surface,
            borderRadius: 18,
            padding: 16,
            maxWidth: "85%",
          }}
        >
          <AppText>{m}</AppText>
        </View>
      ))}
      <Field
        label="Message"
        placeholder="Say hello…"
        value={draft}
        onChangeText={setDraft}
      />
      <AppButton
        label="Preview send"
        icon={MessageCircle}
        disabled={!draft.trim()}
        onPress={() => {
          setMessages((v) => [...v, draft.trim()]);
          setDraft("");
        }}
      />
      <PrototypeNote>
        Messages only appear on this screen and disappear when it unmounts.
        Nothing is sent.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export async function sharePreview(title: string) {
  await Share.share({
    message: `${title} — fictional Snowmate UI preview, not a reservation.`,
  });
}
