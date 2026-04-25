import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

import { THEME } from "@/lib/theme";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const t = isDark ? THEME.dark : THEME.light;

  const iconMap = {
    index: "sparkles",
    calendar: "calendar-clear",
    profile: "person-circle",
  } as const;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: t.foreground,
        tabBarInactiveTintColor: t.mutedForeground,
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 16,
          backgroundColor: t.card,
          borderTopWidth: 1,
          borderTopColor: t.border,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            color={color}
            name={iconMap[route.name as keyof typeof iconMap]}
            size={focused ? size + 2 : size}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Quicksand_600SemiBold",
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 6,
          marginTop: 4,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Today", tabBarShowLabel: false }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar", tabBarShowLabel: false }} />
      <Tabs.Screen name="tasks" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarShowLabel: false }} />
    </Tabs>
  );
}
