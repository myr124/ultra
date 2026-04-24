import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SurfaceCard } from "@/src/components/SurfaceCard";
import { theme } from "@/src/constants/theme";
import type { TimelineItem } from "@/src/lib/mock-dashboard";

type SlidingTimelineProps = {
  title: string;
  subtitle: string;
  items: TimelineItem[];
};

const toneMap: Record<TimelineItem["tone"], string> = {
  peak: theme.colors.moss,
  transition: theme.colors.signal,
  trough: theme.colors.accentWarm,
  event: theme.colors.ink,
};

export function SlidingTimeline({ title, subtitle, items }: SlidingTimelineProps) {
  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <SurfaceCard key={item.id} style={styles.card} accent={toneMap[item.tone]}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: toneMap[item.tone] }]} />
              <Text style={styles.badgeText}>{item.label}</Text>
            </View>
          </SurfaceCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 12,
  },
  header: {
    gap: 3,
  },
  title: {
    color: theme.colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.inkMuted,
    fontSize: 15,
  },
  row: {
    gap: 12,
    paddingRight: 20,
  },
  card: {
    width: 240,
    padding: 18,
  },
  time: {
    color: theme.colors.inkMuted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  cardTitle: {
    color: theme.colors.ink,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardBody: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 66,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  badgeText: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
