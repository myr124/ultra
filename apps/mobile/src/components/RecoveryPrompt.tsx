import { StyleSheet, Text } from "react-native";

import { SurfaceCard } from "@/src/components/SurfaceCard";
import { theme } from "@/src/constants/theme";

type RecoveryPromptProps = {
  title: string;
  body: string;
};

export function RecoveryPrompt({ title, body }: RecoveryPromptProps) {
  return (
    <SurfaceCard accent={theme.colors.moss} style={styles.card}>
      <Text style={styles.eyebrow}>Recovery Prompt</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#edf5ee",
  },
  eyebrow: {
    color: theme.colors.moss,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: theme.colors.ink,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  body: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});
