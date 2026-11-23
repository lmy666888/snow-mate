import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bluetooth,
  Check,
  CirclePause,
  CirclePlay,
  History,
  Radio,
  ShieldCheck,
  Square,
  Waves,
} from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
  Badge,
  ChoiceGroup,
  InfoRow,
  MotionChart,
  PageHeader,
  PrototypeNote,
  Row,
  ScreenContainer,
  SectionHeader,
  go,
} from "../../components/ui";
import { colors as c } from "../../theme/tokens";
export function CoachScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Find your flow."
        subtitle="Understand the motion. Enjoy the ride."
      />
      <AppCard style={{ backgroundColor: c.raised, gap: 20 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <ViewIcon />
          <Badge tone="gold">SIMULATION ONLY</Badge>
        </Row>
        <AppText
          style={{
            fontSize: 29,
            lineHeight: 35,
            fontWeight: "600",
            letterSpacing: -0.7,
          }}
        >
          Every turn tells a story.
        </AppText>
        <AppText style={{ color: c.muted }}>
          Explore a synthetic session and see how motion could become useful
          riding insights.
        </AppText>
        <AppButton
          label="Explore a simulated session"
          icon={CirclePlay}
          onPress={() => go("/coach/start")}
        />
      </AppCard>
      <Row style={{ justifyContent: "space-between" }}>
        <Row>
          <Radio size={16} color={c.green} />
          <AppText variant="label" style={{ color: c.muted }}>
            Demo sensor · no hardware connected
          </AppText>
        </Row>
      </Row>
      <SectionHeader
        title="A look at your motion"
        action="Analysis"
        onPress={() => go("/coach/analysis")}
      />
      <AppCard>
        <MotionChart />
        <AppText variant="label" style={{ color: c.muted }}>
          Illustrative board roll. Fixed fixture, not a real measurement.
        </AppText>
      </AppCard>
      <SectionHeader title="Build your riding rhythm" />
      <AppCard>
        <Row>
          <Waves size={24} color={c.accent} />
          <ViewText />
        </Row>
        <AppButton
          label="Explore practice ideas"
          variant="secondary"
          onPress={() => go("/coach/recommendations")}
        />
      </AppCard>
      <InfoRow
        label="Session history"
        value="Sample sessions"
        icon={History}
        onPress={() => go("/coach/history")}
      />
      <PrototypeNote>
        AI coaching is not connected or validated. No technique score,
        diagnosis, or safety claim is produced.
      </PrototypeNote>
    </ScreenContainer>
  );
}
function ViewIcon() {
  return <Activity color={c.accent} size={34} strokeWidth={1.4} />;
}
function ViewText() {
  return (
    <AppText style={{ flex: 1 }}>
      Small steps. More confidence. Your next practice starts with curiosity.
    </AppText>
  );
}
export function StartSessionScreen() {
  const [scenario, setScenario] = useState("Normal motion");
  const [stance, setStance] = useState("Regular");
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Start with a sample."
        subtitle="Explore the session controls before you ride."
      />
      <AppCard>
        <Row>
          <Bluetooth color={c.accent} size={28} />
          <AppText variant="title">Demo motion source</AppText>
        </Row>
        <Badge tone="gold">SYNTHETIC · NO BLE CONNECTION</Badge>
        <AppText style={{ color: c.muted }}>
          A sample session illustrates the interface. Sensor providers,
          deterministic generation, and fault simulation are planned after UI
          approval.
        </AppText>
      </AppCard>
      <ChoiceGroup
        label="Stance preview"
        options={["Regular", "Goofy"]}
        value={stance}
        onChange={setStance}
      />
      <ChoiceGroup
        label="Scenario preview · not executed"
        options={[
          "Normal motion",
          "Irregular motion",
          "Missing samples",
          "Sensor noise",
          "Disconnect",
        ]}
        value={scenario}
        onChange={setScenario}
      />
      <AppCard>
        <InfoRow label="Planned sample rate" value="50 Hz" />
        <InfoRow label="Acceleration units" value="m/s²" />
        <InfoRow label="Angular velocity units" value="rad/s" />
        <InfoRow label="Data origin" value="synthetic" />
      </AppCard>
      <AppButton
        label="Open session preview"
        icon={CirclePlay}
        onPress={() => go("/coach/live")}
      />
      <PrototypeNote>
        Scenario selection is a UI control. This preview always shows the same
        fixture.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function LiveMotionScreen() {
  const [paused, setPaused] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="In your rhythm."
        subtitle="Motion simulation · static chart fixture"
      />
      <Row style={{ justifyContent: "space-between" }}>
        <Badge tone={disconnected ? "gold" : "green"}>
          {disconnected
            ? "DISCONNECTED PREVIEW"
            : paused
              ? "PAUSED PREVIEW"
              : "SESSION PREVIEW"}
        </Badge>
        <Badge tone="gold">SYNTHETIC</Badge>
      </Row>
      <AppCard style={{ alignItems: "center", paddingVertical: 30 }}>
        <AppText variant="caption" style={{ letterSpacing: 2, color: c.muted }}>
          FIXED SAMPLE DURATION
        </AppText>
        <AppText
          style={{
            fontSize: 62,
            lineHeight: 72,
            fontWeight: "300",
            letterSpacing: -2,
          }}
        >
          02:34
        </AppText>
        <AppText variant="label" style={{ color: c.muted }}>
          No collection in progress · 50 Hz target
        </AppText>
      </AppCard>
      <AppCard>
        <MotionChart />
        <Row style={{ justifyContent: "space-between" }}>
          <AppText variant="label" style={{ color: c.muted }}>
            Data quality
          </AppText>
          <AppText
            variant="label"
            style={{ color: disconnected ? c.gold : c.green }}
          >
            {disconnected
              ? "No connection · simulated"
              : "Illustrative · not assessed"}
          </AppText>
        </Row>
      </AppCard>
      <AppText variant="title">Sample turn events</AppText>
      <InfoRow label="00:08 · Heel-side event" value="Fixture" />
      <InfoRow label="00:14 · Toe-side event" value="Fixture" />
      <Row>
        <AppButton
          style={{ flex: 1 }}
          label={paused ? "Resume preview" : "Pause preview"}
          variant="secondary"
          icon={paused ? CirclePlay : CirclePause}
          onPress={() => setPaused(!paused)}
        />
        <AppButton
          style={{ flex: 1 }}
          label="View summary"
          icon={Square}
          onPress={() => go("/coach/summary")}
        />
      </Row>
      <AppButton
        label={
          disconnected
            ? "Reset connection preview"
            : "Preview disconnected state"
        }
        variant="ghost"
        onPress={() => setDisconnected(!disconnected)}
      />
      <PrototypeNote>
        Controls change visual state only. Duration, samples, and turn events
        are fixed illustrations.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function SessionSummaryScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="A little more insight."
        subtitle="Sample session summary"
      />
      <AppCard>
        <Check color={c.accent} size={32} />
        <Badge tone="gold">SYNTHETIC SESSION FIXTURE</Badge>
        <AppText variant="display">02:34</AppText>
        <AppText style={{ color: c.muted }}>
          Illustrative duration · 7,700 fixture samples · 50 Hz target
        </AppText>
        <MotionChart compact />
      </AppCard>
      <AppCard>
        <AppText variant="title">A pattern to explore.</AppText>
        <AppText style={{ color: c.muted }}>
          The sample trace alternates from one side to the other. In a real
          session, calibration and data quality would need to be checked before
          interpreting motion.
        </AppText>
        <PrototypeNote>
          Prewritten explanation, not generated by AI. No real technique
          inference.
        </PrototypeNote>
      </AppCard>
      <AppButton
        label="Explore motion analysis"
        icon={Activity}
        onPress={() => go("/coach/analysis")}
      />
      <AppButton
        label="Practice ideas"
        variant="secondary"
        onPress={() => go("/coach/recommendations")}
      />
    </ScreenContainer>
  );
}
export function MotionAnalysisScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Behind the turn."
        subtitle="Illustrative analysis · synthetic data"
      />
      <AppCard>
        <MotionChart />
        <InfoRow label="Coordinate frame" value="Board-fixed" />
        <InfoRow label="Roll" value="About board X axis" />
        <InfoRow label="Timestamp" value="Session-relative µs" />
      </AppCard>
      <AppText variant="title">What the sample shows</AppText>
      <AppText style={{ color: c.muted }}>
        A repeating side-to-side trace, designed to illustrate a turn rhythm.
        The shape is a hand-authored fixture. Its peaks do not establish edge
        angle, turn quality, or rider skill.
      </AppText>
      <AppCard>
        <ShieldCheck color={c.accent} size={26} />
        <AppText>Good insight starts with trustworthy data.</AppText>
        <AppText variant="label" style={{ color: c.muted }}>
          Future analysis must check calibration, sample gaps, sensor alignment,
          and independent validation before making coaching claims.
        </AppText>
      </AppCard>
      <AppButton
        label="View practice ideas"
        icon={ArrowRight}
        onPress={() => go("/coach/recommendations")}
      />
    </ScreenContainer>
  );
}
export function RecommendationsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="One turn at a time."
        subtitle="General practice ideas · not personalized coaching"
      />
      <Badge tone="gold">PREWRITTEN DEMO · NOT AI GENERATED</Badge>
      {[
        {
          n: "01",
          title: "Start with a gentle warm-up",
          text: "Choose familiar, easy terrain and check how you feel before committing to your session.",
        },
        {
          n: "02",
          title: "Notice your rhythm",
          text: "Reflect on what felt comfortable after a run. A qualified instructor can help turn observations into a suitable practice plan.",
        },
        {
          n: "03",
          title: "Make space to recharge",
          text: "Pause when you need to. Enjoy the mountain at your own pace.",
        },
      ].map((v) => (
        <AppCard key={v.n}>
          <AppText
            variant="caption"
            style={{ color: c.accent, letterSpacing: 2 }}
          >
            PRACTICE IDEA / {v.n}
          </AppText>
          <AppText variant="title">{v.title}</AppText>
          <AppText style={{ color: c.muted }}>{v.text}</AppText>
        </AppCard>
      ))}
      <PrototypeNote>
        These are generic editorial examples. No synthetic or real sensor data
        was used to personalize them.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function SessionHistoryScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Your riding story."
        subtitle="Sample sessions · no real recordings"
      />
      {["Morning rhythm", "A few easy turns", "Finding the flow"].map(
        (title, i) => (
          <AppCard key={title}>
            <Row style={{ justifyContent: "space-between" }}>
              <AppText variant="title">{title}</AppText>
              <Badge tone="gold">SYNTHETIC</Badge>
            </Row>
            <AppText variant="label" style={{ color: c.muted }}>
              Sample session {i + 1} · 02:34 · board frame
            </AppText>
            <AppButton
              label={`View ${title}`}
              variant="secondary"
              onPress={() => go("/coach/summary")}
            />
          </AppCard>
        ),
      )}
    </ScreenContainer>
  );
}
