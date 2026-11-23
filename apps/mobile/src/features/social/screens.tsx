import React, { useCallback, useMemo, useState } from "react";
import {
  Animated,
  ImageBackground,
  PanResponder,
  Pressable,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
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
  Badge,
  BottomSheet,
  ChoiceGroup,
  EmptyState,
  Field,
  IconButton,
  PageHeader,
  PrototypeNote,
  Row,
  ScreenContainer,
  go,
} from "../../components/ui";
import { colors as c } from "../../theme/tokens";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useSocial } from "../../stores/social";
import { eligibility } from "../identity/model";
import { useStorageError } from "../../services/storage";
import {
  demoRepository,
  demoRiders,
  defaultFilters,
  interests,
} from "./demoRepository";
import { displayDistance, distanceKm } from "../regions/model";
import { RiderAvatar } from "./Avatar";
import { images } from "./data";
export function DiscoverScreen() {
  const state = useSocial(),
    reduced = useReducedMotion(),
    storageError = useStorageError();
  const [filters, setFilters] = useState(false),
    [decision, setDecision] = useState(""),
    [moving, setMoving] = useState(false);
  const [position] = useState(() => new Animated.ValueXY());
  const rider = demoRepository.list(state.region, state.filters, state)[0];
  const move = useCallback(
    (like: boolean) => {
      if (!rider || moving) return;
      setMoving(true);
      setDecision(like ? "LIKE" : "PASS");
      Animated.timing(position, {
        toValue: { x: like ? 450 : -450, y: 0 },
        duration: reduced ? 0 : 220,
        useNativeDriver: true,
      }).start(() => {
        const match = state.swipe(rider.id, like ? "like" : "pass");
        position.setValue({ x: 0, y: 0 });
        setDecision("");
        setMoving(false);
        if (match) go(`/discover/match?id=${rider.id}`);
      });
    },
    [rider, moving, position, reduced, state],
  );
  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          !moving && Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => {
          position.setValue({ x: g.dx, y: g.dy * 0.1 });
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
        onPanResponderTerminate: () => {
          setDecision("");
          position.setValue({ x: 0, y: 0 });
        },
      }),
    [moving, move, position],
  );
  const blockedReason = eligibility(state.identity);
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change discovery region"
          onPress={() => go("/profile/region")}
        >
          <Row>
            <MapPin size={15} color={c.accent} />
            <AppText variant="label">
              {state.region.city} ·{" "}
              {state.region.discovery === "all"
                ? "All regions"
                : state.region.discovery}
            </AppText>
          </Row>
        </Pressable>
        <IconButton
          icon={SlidersHorizontal}
          label="Discovery preferences"
          onPress={() => setFilters(true)}
        />
      </Row>
      <Badge>FICTIONAL DEMO · 18+</Badge>
      {storageError && (
        <AppCard>
          <AppText accessibilityRole="alert">{storageError}</AppText>
        </AppCard>
      )}
      {blockedReason ? (
        <EmptyState
          title={
            blockedReason === "adult-required"
              ? "Adult riders only."
              : "Complete your riding identity."
          }
          message={
            blockedReason === "photo-required"
              ? "Add at least one photo before account-preview discovery."
              : "Complete onboarding before meeting other riders. Demo identities must also be 18 or older."
          }
          action="Continue onboarding"
          onPress={() => go("/identity/onboarding")}
        />
      ) : !state.discoveryVisible ? (
        <EmptyState
          title="Discovery is paused."
          message="Turn discovery on in privacy settings to explore fictional riders."
          action="Settings"
          onPress={() => go("/profile/settings")}
        />
      ) : rider ? (
        <>
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
                        outputRange: ["-10deg", "0deg", "10deg"],
                      }),
                },
              ],
            }}
          >
            <ImageBackground
              source={images.mountain}
              imageStyle={{ width: "100%", height: "100%", borderRadius: 24 }}
              style={{
                minHeight: 360,
                borderRadius: 24,
                overflow: "hidden",
                justifyContent: "space-between",
              }}
            >
              <Row style={{ padding: 18, justifyContent: "space-between" }}>
                <RiderAvatar rider={rider} size={72} />
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
                    top: 105,
                    left: 20,
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: decision === "LIKE" ? c.green : c.coral,
                    backgroundColor: c.surface,
                  }}
                >
                  <AppText variant="title">{decision}</AppText>
                </View>
              )}
              <View
                style={{ padding: 20, gap: 10, backgroundColor: c.overlay }}
              >
                <AppText variant="title">
                  {rider.name}, {rider.age}
                </AppText>
                <Row>
                  <Badge>{rider.level}</Badge>
                  <Badge>{rider.stance}</Badge>
                </Row>
                <AppText variant="label">
                  {rider.city} ·{" "}
                  {displayDistance(
                    distanceKm(state.region.city, rider.city),
                    state.region.distanceUnit,
                    state.language,
                  )}
                </AppText>
                <AppText variant="label">{rider.resort}</AppText>
                <Row style={{ flexWrap: "wrap" }}>
                  {rider.interests.map((v) => (
                    <Badge key={v}>{v}</Badge>
                  ))}
                </Row>
                <PrototypeNote>
                  Fictional identity · initials placeholder · generic mountain
                  photo
                </PrototypeNote>
              </View>
            </ImageBackground>
          </Animated.View>
          <Row style={{ justifyContent: "center", gap: 28 }}>
            <IconButton
              icon={X}
              label="Pass rider"
              size={60}
              onPress={() => move(false)}
            />
            <IconButton
              icon={RotateCcw}
              label="Undo last swipe"
              onPress={state.undo}
            />
            <IconButton
              icon={Heart}
              label="Like rider"
              size={60}
              accent
              onPress={() => move(true)}
            />
          </Row>
        </>
      ) : (
        <EmptyState
          title="A little more room to explore."
          message="No unseen fictional riders match these filters. Adjust your region, interests or distance, or revisit viewed profiles."
          action="Revisit viewed profiles"
          onPress={state.resetViewed}
        />
      )}
      <PrototypeNote>
        Demo likes only match when a seeded fictional rider has also liked you.
        No real people or activity.
      </PrototypeNote>
      <AppButton
        label="Manage discovery filters"
        variant="ghost"
        onPress={() => setFilters(true)}
      />
      <BottomSheet
        visible={filters}
        title="Your kind of riding"
        onClose={() => setFilters(false)}
      >
        <ChoiceGroup
          label="Skill level"
          options={[
            "All levels",
            "Beginner",
            "Intermediate",
            "Advanced",
            "Expert",
          ]}
          value={state.filters.level}
          onChange={(level) => state.setFilters({ level })}
        />
        <ChoiceGroup
          label="Stance"
          options={["Any stance", "Regular", "Goofy"]}
          value={state.filters.stance}
          onChange={(stance) => state.setFilters({ stance })}
        />
        <ChoiceGroup
          label="Interests"
          options={["Any interest", ...interests]}
          value={state.filters.interest}
          onChange={(interest) => state.setFilters({ interest })}
        />
        <AppButton
          label="Reset filters"
          variant="secondary"
          onPress={() => state.setFilters(defaultFilters)}
        />
        <AppButton label="Apply filters" onPress={() => setFilters(false)} />
      </BottomSheet>
    </ScreenContainer>
  );
}
export function RiderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    state = useSocial(),
    rider = demoRiders.find((r) => r.id === id);
  return (
    <ScreenContainer>
      <PageHeader back title="A shared mountain story." />
      {!rider || state.blocked.includes(rider.id) ? (
        <EmptyState
          title="Rider unavailable."
          message="This fictional rider is not available."
        />
      ) : (
        <>
          <RiderAvatar rider={rider} size={100} />
          <AppText variant="display">
            {rider.name}, {rider.age}
          </AppText>
          <Badge>FICTIONAL DEMO · 18+</Badge>
          <AppText>
            {rider.city} · {rider.country}
          </AppText>
          <Row>
            <Badge>{rider.level}</Badge>
            <Badge>{rider.stance}</Badge>
          </Row>
          <AppText>{rider.bio}</AppText>
          <AppCard>
            <AppText variant="title">Riding identity</AppText>
            <AppText>{rider.resort}</AppText>
            <AppText>{rider.style}</AppText>
            <Row style={{ flexWrap: "wrap" }}>
              {rider.interests.map((v) => (
                <Badge key={v}>{v}</Badge>
              ))}
            </Row>
            <AppText>{rider.preference}</AppText>
          </AppCard>
          <PrototypeNote>
            Illustrated initials are placeholders. This is a deterministic
            fictional profile, not a real Snowmate member.
          </PrototypeNote>
          <AppButton
            label="Block this demo rider"
            variant="secondary"
            onPress={() => {
              state.block(rider.id);
              router.back();
            }}
          />
        </>
      )}
    </ScreenContainer>
  );
}
export function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    state = useSocial(),
    rider = demoRiders.find((r) => r.id === id);
  return (
    <ScreenContainer style={{ paddingTop: 32, gap: 28 }}>
      {!rider ||
      eligibility(state.identity) ||
      !state.matches.includes(id) ||
      state.blocked.includes(id) ? (
        <EmptyState
          title="No demo match here."
          message="A one-sided like does not create a match."
          action="Keep exploring"
          onPress={() => go("/(tabs)/discover")}
        />
      ) : (
        <>
          <Badge tone="green">DETERMINISTIC DEMO MATCH</Badge>
          <AppText
            style={{
              fontSize: 42,
              lineHeight: 49,
              fontWeight: "500",
              letterSpacing: -1,
            }}
          >
            Same mountain.{"\n"}New connection.
          </AppText>
          <View style={{ alignItems: "center", padding: 30 }}>
            <RiderAvatar rider={rider} size={130} />
            <Heart size={30} color={c.accent} style={{ marginTop: 18 }} />
          </View>
          <AppText
            localize={false}
            variant="title"
            style={{ textAlign: "center" }}
          >
            {state.identity.name} & {rider.name}
          </AppText>
          <AppText style={{ color: c.muted, textAlign: "center" }}>
            Both demo identities liked each other. This celebration represents a
            seeded fictional match, not real activity.
          </AppText>
          <AppButton
            label="Say hello"
            icon={MessageCircle}
            onPress={() => go(`/discover/chat?id=${id}`)}
          />
          <AppButton
            label="Keep exploring"
            variant="secondary"
            onPress={() => router.dismissTo("/(tabs)/discover")}
          />
        </>
      )}
    </ScreenContainer>
  );
}
export function MatchesScreen() {
  const state = useSocial(),
    matched = demoRiders.filter(
      (r) =>
        !eligibility(state.identity) &&
        state.matches.includes(r.id) &&
        !state.blocked.includes(r.id),
    );
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Your mountain crew."
        subtitle="Fictional demo connections"
      />
      {!matched.length ? (
        <EmptyState
          title="A connection starts with two likes."
          message="Explore the fictional deck. Seeded reciprocal likes create demo connections."
          action="Discover riders"
          onPress={() => go("/(tabs)/discover")}
        />
      ) : (
        matched.map((r) => (
          <Pressable
            accessibilityRole="button"
            key={r.id}
            onPress={() => go(`/discover/chat?id=${r.id}`)}
          >
            <AppCard>
              <Row>
                <RiderAvatar rider={r} size={54} />
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText variant="title" style={{ fontSize: 20 }}>
                    {r.name}
                  </AppText>
                  <AppText variant="label">{r.city}</AppText>
                  <Badge>FICTIONAL DEMO</Badge>
                </View>
              </Row>
            </AppCard>
          </Pressable>
        ))
      )}
    </ScreenContainer>
  );
}
export function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    state = useSocial(),
    [draft, setDraft] = useState(""),
    rider = demoRiders.find((r) => r.id === id),
    allowed =
      !eligibility(state.identity) &&
      rider &&
      state.matches.includes(id) &&
      !state.blocked.includes(id);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title={rider?.name ?? "Demo conversation"}
        subtitle="Local demo chat · nothing is sent"
      />
      {!allowed ? (
        <EmptyState
          title="Conversation unavailable."
          message="Only matched, unblocked demo riders have a conversation."
        />
      ) : (
        <>
          <Row>
            <RiderAvatar rider={rider} size={50} />
            <Badge>FICTIONAL DEMO</Badge>
          </Row>
          {(state.chats[id] ?? []).map((m) => (
            <AppCard
              key={m.id}
              style={{
                alignSelf: m.author === "you" ? "flex-end" : "flex-start",
                maxWidth: "90%",
                backgroundColor: m.author === "you" ? c.raised : c.surface,
              }}
            >
              <AppText localize={m.author !== "you"}>{m.body}</AppText>
            </AppCard>
          ))}
          <Field
            label="Message"
            value={draft}
            onChangeText={setDraft}
            placeholder="Say hello…"
          />
          <AppButton
            label="Save demo message"
            disabled={!draft.trim() || draft.length > 2000}
            onPress={() => {
              state.send(id, draft);
              setDraft("");
            }}
          />
          <PrototypeNote>
            Messages persist locally for this demo. No network delivery, real
            user, or AI reply.
          </PrototypeNote>
        </>
      )}
    </ScreenContainer>
  );
}
