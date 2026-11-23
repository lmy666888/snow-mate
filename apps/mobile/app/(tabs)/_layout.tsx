import { Tabs } from "expo-router";
import {
  Compass,
  Mountain,
  Activity,
  Users,
  UserRound,
} from "lucide-react-native";
import { colors } from "../../src/theme/tokens";
const icons = {
  discover: Compass,
  trips: Mountain,
  coach: Activity,
  community: Users,
  profile: UserRound,
};
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 86,
          paddingTop: 10,
          paddingBottom: 22,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: 4 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {Object.entries(icons).map(([name, Icon]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: name[0].toUpperCase() + name.slice(1),
            tabBarIcon: ({ color, size }) => (
              <Icon size={size - 2} color={color} strokeWidth={1.6} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
