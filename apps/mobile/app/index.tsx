import { ScrollView, StyleSheet, Text, View } from "react-native";

import { EnergyAvatar } from "@/src/components/EnergyAvatar";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { theme } from "@/src/constants/theme";
import { getEnergyPreview } from "@/src/lib/mock-energy";

const preview = getEnergyPreview();

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.title}>Ultra reads your energy before it schedules your day.</Text>
        <Text style={styles.subtitle}>
          The base scaffold is wired for the mobile-first dashboard, shared energy types, and
          a server-side scheduling core.
        </Text>
      </View>

      <SurfaceCard>
        <View style={styles.row}>
          <EnergyAvatar state={preview.avatarState} />
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Composite Index</Text>
            <Text style={styles.metricValue}>{preview.energyState.compositeIndex}</Text>
            <Text style={styles.metricHint}>{preview.energyState.ultradianPhase} phase</Text>
          </View>
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.cardTitle}>Current signal</Text>
        <Text style={styles.cardBody}>
          Circadian baseline {preview.energyState.circadianBaseline}, sleep pressure{" "}
          {preview.energyState.sleepPressure}, confidence {preview.energyState.confidence}.
        </Text>
      </SurfaceCard>

      <SurfaceCard accent={theme.colors.accentWarm}>
        <Text style={styles.cardTitle}>Recommended next step</Text>
        <Text style={styles.cardBody}>
          Keep this screen as the `Today` shell. The next layer should replace mock data with
          tRPC queries for `energy.getTodayTimeline` and `recommendations.list`.
        </Text>
      </SurfaceCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    paddingHorizontal: 20,
    paddingTop: 84,
    paddingBottom: 40,
    backgroundColor: theme.colors.canvas,
  },
  hero: {
    gap: 10,
  },
  eyebrow: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.ink,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.inkMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  metricBlock: {
    gap: 6,
  },
  metricLabel: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  metricValue: {
    color: theme.colors.ink,
    fontSize: 48,
    fontWeight: "800",
  },
  metricHint: {
    color: theme.colors.moss,
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  cardTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  cardBody: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 23,
  },
});
