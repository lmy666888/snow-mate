import React, { useState } from "react";
import { Image, Pressable, Share, View } from "react-native";
import {
  ArrowUpRight,
  Camera,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
} from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
  Avatar,
  Badge,
  Chip,
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
export function PostCard({ detail = false }: { detail?: boolean }) {
  const [liked, setLiked] = useState(false);
  return (
    <View
      style={{
        borderRadius: 22,
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.border,
        overflow: "hidden",
      }}
    >
      <Row style={{ padding: 16 }}>
        <Avatar />
        <View style={{ flex: 1 }}>
          <AppText style={{ fontWeight: "600" }}>Riley Chen</AppText>
          <Row style={{ gap: 4 }}>
            <MapPin size={11} color={c.muted} />
            <AppText variant="caption" style={{ color: c.muted }}>
              Stowe · fictional post
            </AppText>
          </Row>
        </View>
        <Badge>DEMO</Badge>
      </Row>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open mountain day post"
        onPress={() => !detail && go("/community/post")}
      >
        <Image
          source={images.mountain}
          accessibilityLabel="Stock mountain landscape, not a photo taken by the fictional rider"
          style={{ height: 245, width: "100%" }}
        />
      </Pressable>
      <View style={{ padding: 18, gap: 14 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Row style={{ gap: 18 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                liked ? "Unlike sample post" : "Like sample post"
              }
              onPress={() => setLiked(!liked)}
              style={{
                minHeight: 44,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Heart
                size={23}
                color={liked ? c.coral : c.text}
                fill={liked ? c.coral : "transparent"}
              />
              <AppText variant="label">{liked ? 25 : 24}</AppText>
            </Pressable>
            <IconButton
              icon={MessageCircle}
              label="Read sample comments"
              onPress={() => go("/community/post")}
            />
          </Row>
          <IconButton
            icon={ArrowUpRight}
            label="Share sample post"
            onPress={() => {
              void Share.share({
                message:
                  "A mountain day worth remembering — Snowmate fictional community preview.",
              });
            }}
          />
        </Row>
        <AppText>
          That first quiet moment above the clouds. This is why we keep coming
          back. 🏔
        </AppText>
        <AppText variant="caption" style={{ color: c.muted }}>
          SAMPLE CAPTION · STOCK PHOTOGRAPHY
        </AppText>
      </View>
    </View>
  );
}
export function CommunityScreen() {
  const [filter, setFilter] = useState("For you");
  return (
    <ScreenContainer>
      <PageHeader
        title="Better, together."
        subtitle="Stories from a life on the mountain."
        right={
          <IconButton
            icon={Plus}
            label="Create a post"
            onPress={() => go("/community/create")}
          />
        }
      />
      <Row>
        {["For you", "Your crew", "Mountain stories"].map((v) => (
          <Chip
            key={v}
            label={v}
            selected={v === filter}
            onPress={() => setFilter(v)}
          />
        ))}
      </Row>
      <PrototypeNote>{filter} · sample feed preview</PrototypeNote>
      <PostCard />
      <AppCard>
        <Badge>WEEKEND ROLL CALL</Badge>
        <AppText variant="title">Who’s chasing first chair?</AppText>
        <AppText style={{ color: c.muted }}>
          Meet a fictional crew, share a plan, and imagine your next day out.
        </AppText>
        <AppButton
          label="Find your riding crew"
          variant="secondary"
          onPress={() => go("/(tabs)/discover")}
        />
      </AppCard>
    </ScreenContainer>
  );
}
export function PostDetailScreen() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    "Jordan: That view never gets old.",
    "Sam: Saving this for our next mountain day.",
  ]);
  return (
    <ScreenContainer>
      <PageHeader back title="A day worth sharing." />
      <PostCard detail />
      <AppText variant="title">Around the lodge</AppText>
      {comments.map((v, i) => (
        <AppCard key={i}>
          <AppText>{v}</AppText>
        </AppCard>
      ))}
      <Field
        label="Add a sample comment"
        value={comment}
        onChangeText={setComment}
        placeholder="Share a little mountain stoke…"
      />
      <AppButton
        label="Preview comment"
        disabled={!comment.trim()}
        onPress={() => {
          setComments((v) => [...v, `You: ${comment.trim()}`]);
          setComment("");
        }}
      />
      <PrototypeNote>
        Comments are temporary screen state. Nothing is published.
      </PrototypeNote>
    </ScreenContainer>
  );
}
export function CreatePostScreen() {
  const [caption, setCaption] = useState("");
  const [resort, setResort] = useState("Stowe Mountain");
  const notify = usePrototype((s) => s.notify);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Share a mountain moment."
        subtitle="Create post · visual preview"
      />
      <Image
        source={images.mountain}
        style={{ width: "100%", height: 215, borderRadius: 20 }}
        accessibilityLabel="Replaceable stock mountain photograph"
      />
      <AppButton
        label="Photo picker preview"
        icon={Camera}
        variant="secondary"
        onPress={() => notify("Photo picker is planned after UI approval.")}
      />
      <Field
        label="Caption"
        multiline
        placeholder="What made your mountain day?"
        value={caption}
        onChangeText={setCaption}
      />
      <Field label="Resort tag" value={resort} onChangeText={setResort} />
      <AppButton
        label="Preview publish confirmation"
        disabled={!caption.trim()}
        onPress={() =>
          notify("Post preview looks good. Nothing was uploaded or published.")
        }
      />
      <PrototypeNote>
        Photos, captions, and resort tags remain local to this screen.
      </PrototypeNote>
    </ScreenContainer>
  );
}
