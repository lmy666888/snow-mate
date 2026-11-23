import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Star,
  Trash2,
} from "lucide-react-native";
import { useSocial } from "../../stores/social";
import {
  deletePhoto,
  resolvePhoto,
  saveLocalPhoto,
} from "../../services/photos";
import {
  AppButton,
  AppCard,
  AppText,
  Badge,
  IconButton,
  PrototypeNote,
  Row,
} from "../../components/ui";
import { colors as c } from "../../theme/tokens";
import type { LocalPhoto } from "./model";
export function LocalPhotoView({
  photo,
  height = 180,
}: {
  photo: LocalPhoto;
  height?: number;
}) {
  const [uri, setUri] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    let active = true;
    void resolvePhoto(photo)
      .then((value) => {
        if (active) setUri(value);
      })
      .catch(() => {
        if (active) setUri(null);
      });
    return () => {
      active = false;
    };
  }, [photo]);
  if (uri === undefined)
    return (
      <View style={{ height, justifyContent: "center" }}>
        <ActivityIndicator color={c.accent} />
      </View>
    );
  return uri ? (
    <Image
      source={{ uri }}
      accessibilityLabel="Your local photo"
      style={{ width: "100%", height, borderRadius: 16 }}
    />
  ) : (
    <View
      style={{
        height,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: c.raised,
        borderRadius: 16,
      }}
    >
      <AppText>Photo unavailable on this device</AppText>
    </View>
  );
}
export function PhotoManager() {
  const photos = useSocial((s) => s.identity.photos),
    update = useSocial((s) => s.updateIdentity);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const select = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 6 - photos.length,
        quality: 0.8,
        exif: false,
      });
      if (result.canceled) return;
      for (const asset of result.assets) {
        if (useSocial.getState().identity.photos.length >= 6)
          throw new Error("You can keep up to six photos.");
        const mime =
          asset.mimeType ??
          (asset.fileName?.toLowerCase().endsWith(".png")
            ? "image/png"
            : asset.fileName?.toLowerCase().endsWith(".webp")
              ? "image/webp"
              : "image/jpeg");
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024)
          throw new Error("Choose an image under 5 MB.");
        const photo = await saveLocalPhoto(asset.uri, mime);
        update({ photos: [...useSocial.getState().identity.photos, photo] });
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save this photo on your device.",
      );
    } finally {
      setBusy(false);
    }
  };
  const move = (index: number, delta: number) => {
    const next = [...photos];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    update({ photos: next });
  };
  return (
    <View style={{ gap: 16 }}>
      <Row style={{ justifyContent: "space-between" }}>
        <AppText variant="title">Your photo collection</AppText>
        <Badge>{photos.length} / 6</Badge>
      </Row>
      <PrototypeNote>
        Saved only on this device. No upload, cloud storage, or public sharing.
        First photo is primary.
      </PrototypeNote>
      {photos.map((photo, i) => (
        <AppCard key={photo.id}>
          <LocalPhotoView photo={photo} />
          <Row style={{ justifyContent: "space-between" }}>
            <Badge>{i === 0 ? "Primary photo" : "Local photo"}</Badge>
            <Row>
              {i > 0 && (
                <IconButton
                  icon={ArrowLeft}
                  label="Move photo earlier"
                  onPress={() => move(i, -1)}
                />
              )}
              {i < photos.length - 1 && (
                <IconButton
                  icon={ArrowRight}
                  label="Move photo later"
                  onPress={() => move(i, 1)}
                />
              )}
              <IconButton
                icon={Trash2}
                label="Delete photo"
                onPress={() => {
                  void deletePhoto(photo)
                    .then(() =>
                      update({
                        photos: photos.filter((p) => p.id !== photo.id),
                      }),
                    )
                    .catch(() =>
                      setError("Could not delete this photo. Try again."),
                    );
                }}
              />
            </Row>
          </Row>
          {i > 0 && (
            <AppButton
              label="Make primary"
              icon={Star}
              variant="ghost"
              onPress={() =>
                update({
                  photos: [photo, ...photos.filter((p) => p.id !== photo.id)],
                })
              }
            />
          )}
        </AppCard>
      ))}
      {busy && (
        <Row>
          <ActivityIndicator color={c.accent} />
          <AppText>Saving on this device…</AppText>
        </Row>
      )}
      {error && (
        <AppCard>
          <AppText accessibilityRole="alert" style={{ color: c.coral }}>
            {error}
          </AppText>
          <AppButton
            label="Try again"
            variant="secondary"
            onPress={() => {
              void select();
            }}
          />
        </AppCard>
      )}
      <AppButton
        label={photos.length ? "Add another photo" : "Choose photos"}
        icon={Camera}
        disabled={busy || photos.length >= 6}
        onPress={() => {
          void select();
        }}
      />
      <PrototypeNote>
        JPEG, PNG or WebP · maximum 5 MB each · six photos. Demo mode can use
        initials instead. Local photos may retain source metadata; metadata
        stripping and private cloud upload belong to a later security-reviewed
        milestone.
      </PrototypeNote>
    </View>
  );
}
