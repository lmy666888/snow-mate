import { PageHeader, ScreenContainer } from "../../src/components/ui";
import { PhotoManager } from "../../src/features/identity/PhotoManager";
export default function Photos() {
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Mountain moments, yours."
        subtitle="Private local photo management"
      />
      <PhotoManager />
    </ScreenContainer>
  );
}
