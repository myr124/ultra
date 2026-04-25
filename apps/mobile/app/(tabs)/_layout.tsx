import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const iconMap = {
    index: "sparkles",
    calendar: "calendar-clear",
    tasks: "grid",
    profile: "person-circle",
  } as const;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDark ? "hsl(39 40% 93%)" : "hsl(28 16% 10%)",
        tabBarInactiveTintColor: isDark ? "hsl(36 16% 67%)" : "hsl(33 11% 38%)",
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 16,
          backgroundColor: isDark ? "hsl(180 9% 10%)" : "hsl(42 60% 97%)",
          borderTopWidth: 1,
          borderTopColor: isDark ? "hsl(180 8% 20%)" : "hsl(36 28% 80%)",
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
          fontFamily: "Inter_600SemiBold",
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 6,
          marginTop: 4,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Today" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
