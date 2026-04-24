import { Tabs } from "expo-router";

import { theme } from "@/src/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.ink,
        tabBarInactiveTintColor: theme.colors.inkMuted,
        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          paddingBottom: 18,
          backgroundColor: theme.colors.paper,
          borderTopWidth: 1,
          borderTopColor: theme.colors.stroke,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 6,
          marginTop: 6,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Today" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
