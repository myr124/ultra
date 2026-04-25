import { useMemo, useState } from "react";
import { ScrollView } from "react-native";

import { DayTimeline, type DayTimelineHighlight, type DayTimelineItem } from "@/src/components/DayTimeline";
import { mvpPreview } from "@/src/lib/mock-dashboard";

const recommendationAccentMap = {
  focus_block: "primary",
  recovery_break: "accent",
  fitness_slot: "foreground",
  fun_slot: "foreground",
} as const;

const recommendationLabelMap = {
  focus_block: "Focus recommendation",
  recovery_break: "Recovery recommendation",
  fitness_slot: "Fitness recommendation",
  fun_slot: "Fun recommendation",
} as const;

export default function CalendarScreen() {
  const { recommendations, calendarEvents, focusWindows } = mvpPreview;
  const [recommendationState, setRecommendationState] = useState<Record<string, "pending" | "accepted" | "ignored">>(
    () =>
      Object.fromEntries(recommendations.map((recommendation) => [recommendation.id, "pending"])) as Record<
        string,
        "pending" | "accepted" | "ignored"
      >,
  );

  const highlightWindows = useMemo<DayTimelineHighlight[]>(
    () =>
      focusWindows.map((window) => ({
        id: window.id,
        label: window.label,
        startMinute: window.startMinute,
        endMinute: window.endMinute,
      })),
    [focusWindows],
  );

  const timelineItems = useMemo<DayTimelineItem[]>(
    () =>
      [
        ...calendarEvents.map((event) => ({
          id: event.id,
          title: event.title,
          subtitle: event.timeRange,
          startMinute: event.startMinute,
          endMinute: event.endMinute,
          kind: "event" as const,
          accent: "foreground" as const,
          badgeLabel: "Calendar",
          metaLabel: event.provider,
        })),
        ...recommendations.flatMap((recommendation) => {
          const status = recommendationState[recommendation.id];
          const timelineStatus: DayTimelineItem["status"] = status === "accepted" ? "accepted" : "pending";

          if (status === "ignored") {
            return [];
          }

          return [
            {
              id: recommendation.id,
              title: recommendation.title,
              subtitle: recommendation.rationale[0] ?? recommendation.timeRange,
              startMinute: recommendation.startMinute,
              endMinute: recommendation.endMinute,
              kind: "recommendation" as const,
              accent: recommendationAccentMap[recommendation.type],
              badgeLabel: recommendationLabelMap[recommendation.type],
              metaLabel: recommendation.timeRange,
              status: timelineStatus,
            },
          ];
        }),
      ].sort((a, b) => a.startMinute - b.startMinute),
    [calendarEvents, recommendationState, recommendations],
  );

  const addRecommendation = (id: string) => {
    setRecommendationState((current) => ({ ...current, [id]: "accepted" }));
  };

  const ignoreRecommendation = (id: string) => {
    setRecommendationState((current) => ({ ...current, [id]: "ignored" }));
  };

  return (
    <ScrollView className="bg-background" contentContainerClassName="px-5 pb-10 pt-20">
      <DayTimeline
        title="Calendar timeline"
        highlights={highlightWindows}
        items={timelineItems}
        onAddRecommendation={addRecommendation}
        onIgnoreRecommendation={ignoreRecommendation}
      />
    </ScrollView>
  );
}
