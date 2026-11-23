import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import i18n from "../i18n";
import { useSocial } from "../stores/social";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../theme/tokens";
export function AppProviders({ children }: React.PropsWithChildren) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void useSocial.persist
      .rehydrate()
      .then(() => i18n.changeLanguage(useSocial.getState().language))
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
      }),
  );
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <SafeAreaProvider>
        <QueryClientProvider client={client}>
          {ready ? (
            children
          ) : (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator color={colors.accent} />
            </View>
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
