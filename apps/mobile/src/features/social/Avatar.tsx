import { View } from "react-native";
import { AppText } from "../../components/ui";
import { initials, type DemoRider } from "./demoRepository";
import { colors as c } from "../../theme/tokens";
export function RiderAvatar({
  rider,
  size = 64,
}: {
  rider: DemoRider;
  size?: number;
}) {
  return (
    <View
      accessibilityLabel={`${rider.name} · fictional initials placeholder`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: rider.avatarColor,
        borderWidth: 1,
        borderColor: c.border,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppText
        localize={false}
        style={{
          fontSize: size * 0.3,
          lineHeight: size * 0.45,
          color: c.text,
          fontWeight: "500",
        }}
      >
        {initials(rider.name)}
      </AppText>
    </View>
  );
}
