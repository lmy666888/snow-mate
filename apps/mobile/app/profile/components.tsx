import React, { useState } from "react";
import {
  AppButton,
  AppCard,
  AppText,
  Badge,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  ScreenContainer,
} from "../../src/components/ui";
export default function Components() {
  const [retrying, setRetrying] = useState(false);
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="A considered system."
        subtitle="Component & interaction state gallery"
      />
      <AppCard>
        <Badge>SUCCESS</Badge>
        <AppText>Saved in this preview.</AppText>
        <AppButton label="Primary action" onPress={() => {}} />
        <AppButton
          label="Secondary action"
          variant="secondary"
          onPress={() => {}}
        />
        <AppButton label="Unavailable action" disabled onPress={() => {}} />
      </AppCard>
      <LoadingState />
      <EmptyState
        title="Room for something good."
        message="An empty state makes the next step clear."
      />
      {retrying ? (
        <AppCard>
          <AppText>Preview recovered. No network request was made.</AppText>
        </AppCard>
      ) : (
        <ErrorState retry={() => setRetrying(true)} />
      )}
    </ScreenContainer>
  );
}
