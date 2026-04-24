import { StyleSheet, Text, View } from "react-native";

import type { EnergyState } from "@ultra/shared";

import { theme } from "@/src/constants/theme";

type EnergyGaugeProps = {
  energyState: EnergyState;
};

const phaseTone: Record<EnergyState["ultradianPhase"], string> = {
  peak: theme.colors.moss,
  transition: theme.colors.signal,
  trough: theme.colors.accentWarm,
};

export function EnergyGauge({ energyState }: EnergyGaugeProps) {
  return (
    <View style={styles.shell}>
      <Text style={styles.kicker}>Composite Index</Text>
      <Text style={styles.value}>{energyState.compositeIndex}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${energyState.compositeIndex}%` }]} />
      </View>
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Phase</Text>
          <Text style={[styles.metricValue, { color: phaseTone[energyState.ultradianPhase] }]}>
            {energyState.ultradianPhase}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Sleep</Text>
          <Text style={styles.metricValue}>{energyState.sleepPressure}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Trust</Text>
          <Text style={styles.metricValue}>{Math.round(energyState.confidence * 100)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    gap: 12,
    paddingVertical: 10,
  },
  kicker: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  value: {
    color: theme.colors.ink,
    fontSize: 54,
    lineHeight: 56,
    fontWeight: "800",
  },
  barTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: theme.colors.stroke,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.signal,
  },
  metrics: {
    flexDirection: "row",
    gap: 8,
  },
  metric: {
    flex: 1,
    gap: 4,
    backgroundColor: theme.colors.panel,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metricLabel: {
    color: theme.colors.inkMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  metricValue: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
