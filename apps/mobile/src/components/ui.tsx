import React from "react";
import { useTranslation } from "react-i18next";
import { tr } from "../i18n";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
  type StyleProp,
  type ViewStyle,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href } from "expo-router";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Mountain,
  X,
  type LucideIcon,
} from "lucide-react-native";
import Svg, { Path, Line } from "react-native-svg";
import { colors as c, radii } from "../theme/tokens";
import { usePrototype } from "../stores/prototype";
import { images } from "../features/social/data";
import { chartPoints } from "../features/coach/fixtures";
export const go = (path: string) => router.push(path as Href);
export function AppText({
  children,
  variant = "body",
  style,
  ...props
}: React.ComponentProps<typeof Text> & {
  variant?: "body" | "caption" | "label" | "title" | "display";
}) {
  useTranslation();
  return (
    <Text {...props} style={[s.text, s[variant], style]}>
      {React.Children.map(children, (child) =>
        typeof child === "string" ? tr(child) : child,
      )}
    </Text>
  );
}
export function AppButton({
  label,
  onPress,
  variant = "primary",
  icon: Icon,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  useTranslation();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tr(label)}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        variant === "primary"
          ? s.primaryButton
          : variant === "secondary"
            ? s.secondaryButton
            : null,
        { opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
        style,
      ]}
    >
      {Icon && (
        <Icon size={18} color={variant === "primary" ? c.ink : c.accent} />
      )}
      <AppText
        style={{
          fontWeight: "700",
          color: variant === "primary" ? c.ink : c.accent,
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
export function IconButton({
  icon: Icon,
  label,
  onPress,
  size = 44,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  size?: number;
  accent?: boolean;
}) {
  useTranslation();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tr(label)}
      onPress={onPress}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: accent ? c.accent : c.border,
        backgroundColor: accent ? c.accent : c.surface,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.65 : 1,
      })}
    >
      <Icon
        size={size > 55 ? 26 : 20}
        color={accent ? c.ink : c.text}
        strokeWidth={1.7}
      />
    </Pressable>
  );
}
export function AppCard({
  children,
  style,
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Row({
  children,
  style,
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[s.row, style]}>{children}</View>;
}
export function Badge({
  children,
  tone = "accent",
}: React.PropsWithChildren<{ tone?: "accent" | "green" | "gold" | "muted" }>) {
  const color = {
    accent: c.accent,
    green: c.green,
    gold: c.gold,
    muted: c.muted,
  }[tone];
  return (
    <View
      style={[
        s.badge,
        { borderColor: color + "35", backgroundColor: c.surface },
      ]}
    >
      <AppText variant="caption" style={{ color, fontWeight: "600" }}>
        {children}
      </AppText>
    </View>
  );
}
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityState={{ selected }}
      aria-pressed={selected}
      onPress={onPress}
      style={[
        s.chip,
        selected && { backgroundColor: c.accent, borderColor: c.accent },
      ]}
    >
      <AppText variant="label" style={{ color: selected ? c.ink : c.muted }}>
        {label}
      </AppText>
    </Pressable>
  );
}
export function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <Row style={{ justifyContent: "space-between", marginTop: 12 }}>
      <AppText style={{ fontSize: 19, fontWeight: "600" }}>{title}</AppText>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <AppText variant="label" style={{ color: c.accent }}>
            {action} ↗
          </AppText>
        </Pressable>
      )}
    </Row>
  );
}
export function ScreenContainer({
  children,
  style,
  scroll = true,
}: React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  scroll?: boolean;
}>) {
  const notice = usePrototype((s) => s.notice);
  const notify = usePrototype((s) => s.notify);
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: c.background }}
    >
      <View style={s.shell}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[s.content, style]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[s.content, { flex: 1 }, style]}>{children}</View>
        )}
        {notice && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tr("Dismiss notification")}
            accessibilityLiveRegion="polite"
            onPress={() => notify(null)}
            style={s.toast}
          >
            <Check size={18} color={c.accent} />
            <AppText style={{ flex: 1 }}>{notice}</AppText>
            <X color={c.muted} size={18} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
export function PageHeader({
  title,
  subtitle,
  back = false,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <View style={{ gap: 9, paddingTop: 8, paddingBottom: 8 }}>
      {back && (
        <Row style={{ justifyContent: "space-between", marginBottom: 9 }}>
          <IconButton
            icon={ArrowLeft}
            label="Go back"
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace("/(tabs)/discover")
            }
          />
          <Badge>DEMO PREVIEW</Badge>
        </Row>
      )}
      <Row style={{ justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <AppText
            variant="caption"
            style={{
              color: c.accent,
              fontFamily: "SnowmateScript",
              fontSize: 35,
              lineHeight: 42,
              marginBottom: 8,
            }}
          >
            Snowmate
          </AppText>
          <AppText variant="display">{title}</AppText>
        </View>
        {right}
      </Row>
      {subtitle && <AppText style={{ color: c.muted }}>{subtitle}</AppText>}
    </View>
  );
}
export function Avatar({ size = 42 }: { size?: number }) {
  return (
    <Image
      source={images.rider}
      accessibilityLabel="Stock winter sports portrait"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: c.border,
      }}
    />
  );
}
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  secureTextEntry = false,
  keyboardType,
}: {
  label: string;
  value?: string;
  onChangeText?: (s: string) => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
}) {
  useTranslation();
  return (
    <View style={{ gap: 8 }}>
      <AppText variant="label" style={{ color: c.muted }}>
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={tr(label)}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ? tr(placeholder) : undefined}
        placeholderTextColor={c.muted}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[
          s.input,
          multiline && { minHeight: 100, textAlignVertical: "top" },
        ]}
      />
    </View>
  );
}
export function ChoiceGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      <AppText variant="label" style={{ color: c.muted }}>
        {label}
      </AppText>
      <Row style={{ flexWrap: "wrap" }}>
        {options.map((v) => (
          <Chip
            key={v}
            label={v}
            selected={value === v}
            onPress={() => onChange(v)}
          />
        ))}
      </Row>
    </View>
  );
}
export function InfoRow({
  label,
  value,
  icon: Icon = ChevronRight,
  onPress,
}: {
  label: string;
  value?: string;
  icon?: LucideIcon;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : "text"}
      onPress={onPress}
      style={s.infoRow}
    >
      <AppText style={{ flex: 1 }}>{label}</AppText>
      {value && (
        <AppText variant="label" style={{ color: c.muted }}>
          {value}
        </AppText>
      )}
      <Icon size={18} color={c.muted} />
    </Pressable>
  );
}
export function HeroCard({
  title,
  subtitle,
  image = images.mountain,
  onPress,
  tag,
  height = 210,
}: {
  title: string;
  subtitle: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
  tag?: string;
  height?: number;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={tr(title)}
      onPress={onPress}
    >
      <ImageBackground
        source={image}
        style={{
          minHeight: height,
          justifyContent: "flex-end",
          overflow: "hidden",
          borderRadius: radii.md,
        }}
        imageStyle={{ borderRadius: radii.md, width: "100%", height: "100%" }}
      >
        <View style={s.photoShade} />
        <View style={{ padding: 20, gap: 10, backgroundColor: c.overlay }}>
          {tag && (
            <Row>
              <Badge>{tag}</Badge>
            </Row>
          )}
          <Row style={{ justifyContent: "space-between" }}>
            <View style={{ flex: 1, gap: 6 }}>
              <AppText variant="title" style={{ fontSize: 27 }}>
                {title}
              </AppText>
              <AppText variant="label" style={{ color: c.muted }}>
                {subtitle}
              </AppText>
            </View>
            {onPress && <ArrowUpRight size={24} color={c.text} />}
          </Row>
        </View>
      </ImageBackground>
    </Pressable>
  );
}
export function MotionChart({ compact = false }: { compact?: boolean }) {
  const d = chartPoints
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * 14} ${80 - v}`)
    .join(" ");
  return (
    <View
      accessible
      accessibilityLabel="Illustrative synthetic roll angle chart. No real sensor measurements."
      style={{ gap: 12 }}
    >
      <Row style={{ justifyContent: "space-between" }}>
        <AppText variant="label" style={{ color: c.muted }}>
          Board roll · degrees
        </AppText>
        <Badge tone="gold">SYNTHETIC</Badge>
      </Row>
      <Svg
        width="100%"
        height={compact ? 90 : 135}
        viewBox="0 0 310 90"
        preserveAspectRatio="none"
      >
        {[15, 45, 75].map((y) => (
          <Line
            key={y}
            x1={0}
            x2={310}
            y1={y}
            y2={y}
            stroke={c.border}
            strokeDasharray="3,5"
          />
        ))}
        <Path d={d} stroke={c.accent} strokeWidth={2} fill="none" />
      </Svg>
      <Row style={{ justifyContent: "space-between" }}>
        <AppText variant="caption" style={{ color: c.muted }}>
          0:00
        </AppText>
        <AppText variant="caption" style={{ color: c.muted }}>
          0:15
        </AppText>
        <AppText variant="caption" style={{ color: c.muted }}>
          0:30 · fixture
        </AppText>
      </Row>
    </View>
  );
}
export function EmptyState({
  title,
  message,
  action,
  onPress,
}: {
  title: string;
  message: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <AppCard style={{ alignItems: "center", padding: 30 }}>
      <Mountain size={32} color={c.accent} />
      <AppText variant="title" style={{ textAlign: "center" }}>
        {title}
      </AppText>
      <AppText style={{ color: c.muted, textAlign: "center" }}>
        {message}
      </AppText>
      {action && onPress && (
        <AppButton label={action} onPress={onPress} variant="secondary" />
      )}
    </AppCard>
  );
}
export function LoadingState() {
  return (
    <AppCard>
      <ActivityIndicator color={c.accent} />
      <AppText style={{ textAlign: "center", color: c.muted }}>
        Finding your next mountain day…
      </AppText>
    </AppCard>
  );
}
export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <EmptyState
      title="A little off piste"
      message="We couldn’t load this view. Your draft is still here."
      action="Try again"
      onPress={retry}
    />
  );
}
export function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: React.PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
}>) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={s.scrim}>
        <View style={[s.sheet, { maxHeight: "90%" }]}>
          <View
            style={{
              alignSelf: "center",
              width: 36,
              height: 4,
              backgroundColor: c.border,
              borderRadius: 4,
            }}
          />
          <Row style={{ justifyContent: "space-between" }}>
            <AppText variant="title">{title}</AppText>
            <IconButton icon={X} label="Close sheet" onPress={onClose} />
          </Row>
          <ScrollView
            contentContainerStyle={{ gap: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export function PrototypeNote({
  children = "Visual prototype · fictional content · resets on reload",
}: React.PropsWithChildren) {
  return (
    <AppText variant="caption" style={{ color: c.muted, lineHeight: 18 }}>
      {children}
    </AppText>
  );
}
const s = StyleSheet.create({
  text: { color: c.text, fontSize: 15, lineHeight: 23 },
  body: {},
  caption: { fontSize: 10, lineHeight: 16 },
  label: { fontSize: 12, lineHeight: 18 },
  title: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "500",
    letterSpacing: -0.8,
  },
  shell: { width: "100%", maxWidth: 560, alignSelf: "center", flex: 1 },
  content: { padding: 22, paddingBottom: 40, gap: 20 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  card: {
    padding: 20,
    borderRadius: radii.md,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    gap: 16,
  },
  button: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: { backgroundColor: c.accent },
  secondaryButton: {
    backgroundColor: c.raised,
    borderWidth: 1,
    borderColor: c.border,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    minHeight: 44,
  },
  input: {
    color: c.text,
    backgroundColor: c.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
    minHeight: 52,
    padding: 16,
    fontSize: 15,
  },
  infoRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    paddingVertical: 12,
  },
  photoShade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#6F455D08",
  },
  toast: {
    position: "absolute",
    bottom: 14,
    left: 18,
    right: 18,
    padding: 16,
    backgroundColor: c.raised,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  scrim: { flex: 1, backgroundColor: "#0009", justifyContent: "flex-end" },
  sheet: {
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: c.surface,
    gap: 24,
  },
});
export type { TextStyle };
