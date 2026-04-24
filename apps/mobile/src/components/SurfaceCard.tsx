import type { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "@/src/constants/theme";

type SurfaceCardProps = PropsWithChildren<{
  accent?: string;
  style?: StyleProp<ViewStyle>;
}>;

export function SurfaceCard({ accent, children, style }: SurfaceCardProps) {
  return (
    <View style={[styles.card, accent ? { borderLeftColor: accent } : undefined, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.paper,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.stroke,
    padding: 20,
    shadowColor: "#4c3c2c",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
});
