import React, { useState } from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import {
  AppButton,
  AppCard,
  AppText,
  Badge,
  ChoiceGroup,
  Field,
  PageHeader,
  PrototypeNote,
  Row,
  ScreenContainer,
} from "../../components/ui";
import { useSocial } from "../../stores/social";
import { eligibility } from "./model";
import { PhotoManager, LocalPhotoView } from "./PhotoManager";
import { interests } from "../social/demoRepository";
import { colors as c } from "../../theme/tokens";
const steps = [
  "Account",
  "Profile photos",
  "Personal information",
  "Snowboarding identity",
  "Interests",
  "Matching preferences",
  "Profile preview",
];
export default function OnboardingScreen() {
  const { identity, updateIdentity } = useSocial(),
    [step, setStep] = useState(0),
    [error, setError] = useState<string | null>(null);
  const advance = () => {
    setError(null);
    if (
      step === 1 &&
      identity.mode === "account-preview" &&
      identity.photos.length === 0
    ) {
      setError("Add at least one photo for account-preview discovery.");
      return;
    }
    if (
      step === 2 &&
      (!identity.name.trim() ||
        identity.name.length > 60 ||
        !Number.isInteger(identity.age) ||
        identity.age < 18 ||
        identity.age > 100)
    ) {
      setError("Enter a display name and an adult age between 18 and 100.");
      return;
    }
    if (step < 6) setStep(step + 1);
    else {
      const reason = eligibility({ ...identity, complete: true });
      if (reason) {
        setError(
          reason === "adult-required"
            ? "Adult riders only."
            : "Add at least one photo for account-preview discovery.",
        );
        return;
      }
      updateIdentity({ complete: true });
      router.replace("/(tabs)/discover");
    }
  };
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Make it your season."
        subtitle="A riding identity, at your own pace."
      />
      <Row style={{ justifyContent: "space-between" }}>
        <Badge>{step + 1} / 7</Badge>
        <AppText>{steps[step]}</AppText>
      </Row>
      <View style={{ height: 4, backgroundColor: c.border, borderRadius: 4 }}>
        <View
          style={{
            height: 4,
            width: `${((step + 1) / 7) * 100}%`,
            backgroundColor: c.accent,
            borderRadius: 4,
          }}
        />
      </View>
      {step === 0 && (
        <>
          <ChoiceGroup
            label="Identity mode"
            options={["demo", "account-preview"]}
            value={identity.mode}
            onChange={(mode) =>
              updateIdentity({
                mode: mode as "demo" | "account-preview",
                complete: false,
              })
            }
          />
          <AppCard>
            <AppText variant="title">A transparent start.</AppText>
            <AppText>
              Demo mode uses a fictional adult identity without real photo
              uploads. Account preview requires a local photo before discovery,
              but does not create or authenticate a real account.
            </AppText>
            <PrototypeNote>
              Real authentication, verified adult eligibility and secure photo
              upload belong to M2.0. Local controls are not server
              authorization.
            </PrototypeNote>
          </AppCard>
        </>
      )}
      {step === 1 && <PhotoManager />}
      {step === 2 && (
        <>
          <Field
            label="Display name"
            value={identity.name}
            onChangeText={(name) => updateIdentity({ name })}
          />
          <Field
            label="Age · adults only"
            value={String(identity.age || "")}
            keyboardType="numeric"
            onChangeText={(value) =>
              updateIdentity({
                age: /^\d{1,3}$/.test(value) ? Number(value) : 0,
              })
            }
          />
          <Field
            label="Biography"
            multiline
            value={identity.bio}
            onChangeText={(bio) => updateIdentity({ bio: bio.slice(0, 500) })}
          />
          <PrototypeNote>
            No birth date or precise location is collected. Age is a
            self-declared local preview, not verified identity.
          </PrototypeNote>
        </>
      )}
      {step === 3 && (
        <>
          <ChoiceGroup
            label="Snowboarding level"
            options={["Beginner", "Intermediate", "Advanced", "Expert"]}
            value={identity.level}
            onChange={(level) =>
              updateIdentity({ level: level as typeof identity.level })
            }
          />
          <ChoiceGroup
            label="Stance"
            options={["Regular", "Goofy"]}
            value={identity.stance}
            onChange={(stance) =>
              updateIdentity({ stance: stance as typeof identity.stance })
            }
          />
          <ChoiceGroup
            label="Riding style"
            options={["All mountain", "Freestyle", "Freeride", "Groomers"]}
            value={identity.style}
            onChange={(style) => updateIdentity({ style })}
          />
          <Field
            label="Favorite resorts"
            value={identity.favoriteResorts}
            onChangeText={(favoriteResorts) =>
              updateIdentity({ favoriteResorts })
            }
          />
        </>
      )}
      {step === 4 && (
        <>
          <AppText variant="title">What makes your mountain day?</AppText>
          <Row style={{ flexWrap: "wrap" }}>
            {interests.map((v) => (
              <AppButton
                key={v}
                label={v}
                variant={
                  identity.interests.includes(v) ? "primary" : "secondary"
                }
                onPress={() =>
                  updateIdentity({
                    interests: identity.interests.includes(v)
                      ? identity.interests.filter((i) => i !== v)
                      : [...identity.interests, v],
                  })
                }
              />
            ))}
          </Row>
        </>
      )}
      {step === 5 && (
        <>
          <ChoiceGroup
            label="Matching preferences"
            options={["Similar level", "All levels", "Learning together"]}
            value={identity.matching}
            onChange={(matching) => updateIdentity({ matching })}
          />
          <ChoiceGroup
            label="Trip preferences"
            options={["Day trip", "Weekend escape", "Anywhere for snow"]}
            value={identity.tripPreference}
            onChange={(tripPreference) => updateIdentity({ tripPreference })}
          />
          <AppCard>
            <AppText>
              Stranger discovery is limited to adult identities. Public cards
              show only a manually selected city, not an address or GPS
              position.
            </AppText>
          </AppCard>
        </>
      )}
      {step === 6 && (
        <AppCard>
          {identity.photos[0] ? (
            <LocalPhotoView photo={identity.photos[0]} />
          ) : (
            <View
              style={{
                height: 130,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: c.raised,
                borderRadius: 20,
              }}
            >
              <AppText variant="display">{identity.name.slice(0, 1)}</AppText>
              <PrototypeNote>Initials placeholder</PrototypeNote>
            </View>
          )}
          <AppText variant="title">
            {identity.name}, {identity.age}
          </AppText>
          <Row>
            <Badge>{identity.level}</Badge>
            <Badge>{identity.stance}</Badge>
          </Row>
          <AppText>{identity.bio}</AppText>
          <AppText>{identity.favoriteResorts}</AppText>
          <Row style={{ flexWrap: "wrap" }}>
            {identity.interests.map((v) => (
              <Badge key={v}>{v}</Badge>
            ))}
          </Row>
          <Badge>
            {identity.mode === "demo"
              ? "FICTIONAL DEMO"
              : "LOCAL ACCOUNT PREVIEW"}
          </Badge>
        </AppCard>
      )}
      {error && (
        <AppCard>
          <AppText accessibilityRole="alert" style={{ color: c.coral }}>
            {error}
          </AppText>
        </AppCard>
      )}
      <AppButton
        label={step === 6 ? "Finish riding identity" : "Continue"}
        icon={ArrowRight}
        onPress={advance}
      />
      {step > 0 && (
        <AppButton
          label="Previous step"
          variant="secondary"
          icon={ArrowLeft}
          onPress={() => {
            setError(null);
            setStep(step - 1);
          }}
        />
      )}
      <PrototypeNote>
        Progress is saved locally. It is not an authenticated or publicly
        published profile.
      </PrototypeNote>
    </ScreenContainer>
  );
}
