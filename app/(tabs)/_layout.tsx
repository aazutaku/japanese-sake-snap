import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { COLORS } from "../../src/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.borderLight,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerStyle: { backgroundColor: COLORS.background },
        headerTitleStyle: { fontWeight: "700", color: COLORS.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "さがす",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🔍</Text>,
        }}
      />
      <Tabs.Screen
        name="shelves"
        options={{
          title: "マイ棚",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🗄️</Text>,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "コレクション",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏅</Text>,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "追加",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 28, color, marginTop: -4 }}>＋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "プロフィール",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
