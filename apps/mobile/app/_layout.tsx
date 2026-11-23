import { useReducedMotion } from "../src/hooks/useReducedMotion";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProviders } from "../src/providers/AppProviders";
import { colors } from "../src/theme/tokens";
export default function RootLayout() {
  const reduced = useReducedMotion();
  const [fontsLoaded, fontError] = useFonts({
    SnowmateScript: require("../assets/fonts/Allura-Regular.ttf"),
  });
  if (!fontsLoaded && !fontError)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: reduced ? "none" : "slide_from_right",
        }}
      >
        <Stack.Screen
          name="discover/match"
          options={{
            presentation: "modal",
            animation: reduced ? "none" : "fade",
          }}
        />
      </Stack>
    </AppProviders>
  );
}
