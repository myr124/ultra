import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SurfaceCard } from "@/src/components/SurfaceCard";
import { theme } from "@/src/constants/theme";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Profile</Text>
        <Text style={styles.title}>Closed alpha controls for calibration, sync, and nudges.</Text>
        <Text style={styles.subtitle}>
          This is the MVP shell for preferences and connection status, not the final account
          surface.
        </Text>
      </View>

      <SurfaceCard accent={theme.colors.moss}>
        <Text style={styles.cardTitle}>Alpha status</Text>
        <Text style={styles.cardBody}>
          Magic-link auth enabled. Read-only calendar connected. Notifications armed for redline
          crossings, recovery starts, and low-ROI work sessions.
        </Text>
      </SurfaceCard>

      <View style={styles.stack}>
        {mvpPreview.profileItems.map((item) => (
          <SurfaceCard key={item.label}>
            <View style={styles.itemRow}>
              <View style={styles.itemMeta}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemValue}>{item.value}</Text>
              </View>
              <Text style={styles.itemStatus}>{item.status}</Text>
            </View>
          </SurfaceCard>
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
    color: theme.colors.moss,
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
  cardTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  cardBody: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  stack: {
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  itemMeta: {
    flex: 1,
    gap: 4,
  },
  itemLabel: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  itemValue: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "700",
  },
  itemStatus: {
    color: theme.colors.signal,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "capitalize",
  },
});
