import { StyleSheet, Text, View } from "react-native";

import { SurfaceCard } from "@/src/components/SurfaceCard";
import { theme } from "@/src/constants/theme";
import type { RecommendationPreview } from "@/src/lib/mock-dashboard";

type RecommendationCardProps = {
  recommendation: RecommendationPreview;
};

const accentMap: Record<RecommendationPreview["type"], string> = {
  focus_block: theme.colors.signal,
  recovery_break: theme.colors.moss,
  fitness_slot: theme.colors.accentWarm,
  fun_slot: theme.colors.ink,
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <SurfaceCard accent={accentMap[recommendation.type]}>
      <View style={styles.header}>
        <Text style={styles.type}>{recommendation.type.replaceAll("_", " ")}</Text>
        <Text style={styles.time}>{recommendation.timeRange}</Text>
      </View>
      <Text style={styles.title}>{recommendation.title}</Text>
      <View style={styles.rationaleRow}>
        {recommendation.rationale.map((line) => (
          <Text key={line} style={styles.rationale}>
            {line}
          </Text>
        ))}
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  type: {
    color: theme.colors.inkMuted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    flex: 1,
  },
  time: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    color: theme.colors.ink,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  rationaleRow: {
    gap: 6,
  },
  rationale: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 21,
  },
});
