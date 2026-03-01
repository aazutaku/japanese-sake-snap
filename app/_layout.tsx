import React from "react";
import { Stack } from "expo-router";
import { AppProvider } from "../src/store/AppContext";
import { COLORS } from "../src/constants/theme";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.primary,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="shelf/[id]"
          options={{ title: "棚の詳細" }}
        />
        <Stack.Screen
          name="post/new"
          options={{ title: "お酒を追加", presentation: "modal" }}
        />
        <Stack.Screen
          name="post/[id]"
          options={{ title: "詳細" }}
        />
      </Stack>
    </AppProvider>
  );
}
