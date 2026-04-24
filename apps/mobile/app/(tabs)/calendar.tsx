import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SlidingTimeline } from "@/src/components/SlidingTimeline";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { theme } from "@/src/constants/theme";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function CalendarScreen() {
  const focusBlock = mvpPreview.recommendations.find((entry) => entry.type === "focus_block");
  const focusSummary = focusBlock
    ? `${focusBlock.title} during ${focusBlock.timeRange}. Rationale: ${focusBlock.rationale[0].toLowerCase()}.`
    : "No focus block has been placed yet.";

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Read-Only Sync</Text>
        <Text style={styles.title}>Calendar overlays energy instead of fighting it.</Text>
        <Text style={styles.subtitle}>
          Imported events stay fixed. Ultra only proposes openings where your peaks and troughs
          make the day more survivable.
        </Text>
      </View>

      <SurfaceCard accent={theme.colors.signal}>
        <Text style={styles.cardTitle}>Best focus placement</Text>
        <Text style={styles.cardBody}>{focusSummary}</Text>
      </SurfaceCard>

      <SlidingTimeline
        title="Today"
        subtitle="Imported events + recommended blocks"
        items={mvpPreview.timeline}
      />

      <View style={styles.stack}>
        {mvpPreview.calendarEvents.map((event) => (
          <SurfaceCard key={event.id}>
            <View style={styles.eventRow}>
              <View style={styles.eventMeta}>
                <Text style={styles.eventTime}>{event.timeRange}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
              </View>
              <Text style={styles.eventProvider}>{event.provider}</Text>
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
    color: theme.colors.inkMuted,
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
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
  },
  eventMeta: {
    flex: 1,
    gap: 4,
  },
  eventTime: {
    color: theme.colors.signal,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  eventTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "700",
  },
  eventProvider: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
