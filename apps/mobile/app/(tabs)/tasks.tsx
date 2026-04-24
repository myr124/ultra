import { ScrollView, StyleSheet, Text, View } from "react-native";

import { RecommendationCard } from "@/src/components/RecommendationCard";
import { TaskBucketBoard } from "@/src/components/TaskBucketBoard";
import { theme } from "@/src/constants/theme";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function TasksScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Task Allocation</Text>
        <Text style={styles.title}>Three buckets, one energy-aware queue.</Text>
        <Text style={styles.subtitle}>
          Work, fitness, and fun stay visible together so the engine can protect intensity and
          recovery in the same day.
        </Text>
      </View>

      <TaskBucketBoard buckets={mvpPreview.taskBuckets} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested placements</Text>
        <Text style={styles.sectionMeta}>Advisory only</Text>
      </View>

      <View style={styles.stack}>
        {mvpPreview.recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 82,
    paddingBottom: 40,
    gap: 18,
    backgroundColor: theme.colors.canvas,
  },
  hero: {
    gap: 10,
  },
  kicker: {
    color: theme.colors.accentWarm,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.ink,
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "800",
    fontFamily: "Georgia",
  },
  subtitle: {
    color: theme.colors.inkMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  sectionMeta: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stack: {
    gap: 12,
  },
});
