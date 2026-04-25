import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { Button } from "@/components/ui/button";
import { THEME } from "@/lib/theme";

export function ThemeToggleButton() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const t = isDark ? THEME.dark : THEME.light;

  return (
    <Button
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-11 w-11 rounded-full"
      onPress={toggleColorScheme}
      size="icon"
      variant="outline"
    >
      <Ionicons
        color={t.foreground}
        name={isDark ? "sunny" : "moon"}
        size={18}
      />
    </Button>
  );
}