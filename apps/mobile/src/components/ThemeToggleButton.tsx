import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { Button } from "@/components/ui/button";

export function ThemeToggleButton() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Button
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-11 w-11 rounded-full"
      onPress={toggleColorScheme}
      size="icon"
      variant="outline"
    >
      <Ionicons
        color={isDark ? "hsl(39 40% 93%)" : "hsl(28 16% 10%)"}
        name={isDark ? "sunny" : "moon"}
        size={18}
      />
    </Button>
  );
}
