import { ScrollView, StyleSheet, Text, View } from "react-native";

import { EnergyAvatar } from "@/src/components/EnergyAvatar";
import { EnergyGauge } from "@/src/components/EnergyGauge";
import { RecommendationCard } from "@/src/components/RecommendationCard";
import { RecoveryPrompt } from "@/src/components/RecoveryPrompt";
import { SlidingTimeline } from "@/src/components/SlidingTimeline";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { theme } from "@/src/constants/theme";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function TodayScreen() {
  const { energyState, avatarState, recommendations, timeline } = mvpPreview;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Closed Alpha</Text>
        <Text style={styles.title}>Today flexes around your energy, not just your calendar.</Text>
        <Text style={styles.subtitle}>
          Composite index {energyState.compositeIndex}. Peak window lands before your first heavy
          work block, and redline risk stays low if you protect recovery at 2:30 PM.
        </Text>
      </View>

      <SurfaceCard style={styles.heroCard}>
        <View style={styles.energyRow}>
          <EnergyAvatar state={avatarState} />
          <EnergyGauge energyState={energyState} />
        </View>
      </SurfaceCard>

      <RecoveryPrompt
        title="Recovery window in 18 min"
        body="The model sees sleep pressure climbing faster than HRV can offset it. Step out before the next trough and preserve your late-day focus block."
      />

      <SlidingTimeline
        title="Energy Timeline"
        subtitle="Now through tonight"
        items={timeline}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Text style={styles.sectionMeta}>3 live</Text>
      </View>

      <View style={styles.stack}>
        {recommendations.map((recommendation) => (
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
    color: theme.colors.signal,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.ink,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    fontFamily: "Georgia",
  },
  subtitle: {
    color: theme.colors.inkMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  heroCard: {
    padding: 18,
  },
  energyRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
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
