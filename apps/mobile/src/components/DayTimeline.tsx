import { Fragment, useMemo } from "react";
import { Pressable, View, type ViewStyle } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Plus, Trash2 } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

type DayTimelineItem = {
  id: string;
  title: string;
  subtitle: string;
  startMinute: number;
  endMinute: number;
  kind: "event" | "recommendation";
  accent: "primary" | "accent" | "foreground";
  badgeLabel: string;
  metaLabel?: string;
  status?: "pending" | "accepted";
};

type DayTimelineProps = {
  title: string;
  items: DayTimelineItem[];
  highlights?: DayTimelineHighlight[];
  startHour?: number;
  endHour?: number;
  onAddRecommendation?: (id: string) => void;
  onIgnoreRecommendation?: (id: string) => void;
  onSelectEvent?: (id: string) => void;
};

type DayTimelineHighlight = {
  id: string;
  startMinute: number;
  endMinute: number;
  label: string;
};

type PositionedTimelineItem = DayTimelineItem & {
  lane: number;
  laneCount: number;
};

type RhythmSegment = {
  id: string;
  kind: "focus" | "rest";
  label: string;
  startMinute: number;
  endMinute: number;
};

const HOUR_HEIGHT = 88;
const ITEM_GAP_MINUTES = 8;

const MIN_ITEM_HEIGHT: Record<DayTimelineItem["kind"], number> = {
  event: 116,
  recommendation: 124,
};

const PENDING_RECOMMENDATION_HEIGHT = 168;

const accentClassMap: Record<DayTimelineItem["accent"], string> = {
  primary: "border-primary/70 bg-primary/8",
  accent: "border-accent/70 bg-accent/10",
  foreground: "border-foreground/15 bg-card",
};

function formatHour(hour: number) {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

function formatClock(minute: number) {
  const hour = Math.floor(minute / 60);
  const minutePart = minute % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${displayHour}:${minutePart.toString().padStart(2, "0")} ${suffix}`;
}

function getMinimumItemHeight(item: DayTimelineItem) {
  if (item.kind === "recommendation" && item.status === "pending") {
    return PENDING_RECOMMENDATION_HEIGHT;
  }

  return MIN_ITEM_HEIGHT[item.kind];
}

function getRenderedItemHeight(item: DayTimelineItem) {
  const durationHeight =
    ((item.endMinute - item.startMinute) / 60) * HOUR_HEIGHT;
  return Math.max(durationHeight, getMinimumItemHeight(item));
}

function getRenderedEndMinute(item: DayTimelineItem) {
  return item.startMinute + (getRenderedItemHeight(item) / HOUR_HEIGHT) * 60;
}

function buildRhythmSegments(
  highlights: DayTimelineHighlight[],
  startMinute: number,
  endMinute: number,
): RhythmSegment[] {
  const clippedHighlights = highlights
    .map((highlight) => ({
      ...highlight,
      startMinute: Math.max(highlight.startMinute, startMinute),
      endMinute: Math.min(highlight.endMinute, endMinute),
    }))
    .filter((highlight) => highlight.startMinute < highlight.endMinute)
    .sort((a, b) => a.startMinute - b.startMinute);
  const segments: RhythmSegment[] = [];
  let cursor = startMinute;

  for (const highlight of clippedHighlights) {
    if (cursor < highlight.startMinute) {
      segments.push({
        id: `rest-${cursor}-${highlight.startMinute}`,
        kind: "rest",
        label: "Rest",
        startMinute: cursor,
        endMinute: highlight.startMinute,
      });
    }

    segments.push({
      id: highlight.id,
      kind: "focus",
      label: "Focus",
      startMinute: highlight.startMinute,
      endMinute: highlight.endMinute,
    });
    cursor = Math.max(cursor, highlight.endMinute);
  }

  if (cursor < endMinute) {
    segments.push({
      id: `rest-${cursor}-${endMinute}`,
      kind: "rest",
      label: "Rest",
      startMinute: cursor,
      endMinute,
    });
  }

  return segments;
}

function positionItems(items: DayTimelineItem[]): PositionedTimelineItem[] {
  const sorted = [...items].sort(
    (a, b) =>
      a.startMinute - b.startMinute ||
      (a.kind === "event" ? 0 : 1) - (b.kind === "event" ? 0 : 1) ||
      a.endMinute - b.endMinute,
  );
  const positioned: PositionedTimelineItem[] = [];

  let cluster: DayTimelineItem[] = [];
  let clusterEnd = -1;

  const flushCluster = () => {
    if (cluster.length === 0) return;

    const laneEndMinutes: number[] = [];
    const clusterItems: PositionedTimelineItem[] = [];

    for (const item of cluster) {
      const renderedEndMinute = getRenderedEndMinute(item) + ITEM_GAP_MINUTES;
      let lane = laneEndMinutes.findIndex(
        (endMinute) => endMinute <= item.startMinute,
      );

      if (lane === -1) {
        lane = laneEndMinutes.length;
        laneEndMinutes.push(renderedEndMinute);
      } else {
        laneEndMinutes[lane] = renderedEndMinute;
      }

      clusterItems.push({
        ...item,
        lane,
        laneCount: 0,
      });
    }

    const laneCount = laneEndMinutes.length;
    for (const item of clusterItems) {
      item.laneCount = laneCount;
      positioned.push(item);
    }

    cluster = [];
    clusterEnd = -1;
  };

  for (const item of sorted) {
    if (cluster.length === 0) {
      cluster = [item];
      clusterEnd = getRenderedEndMinute(item) + ITEM_GAP_MINUTES;
      continue;
    }

    if (item.startMinute < clusterEnd) {
      cluster.push(item);
      clusterEnd = Math.max(
        clusterEnd,
        getRenderedEndMinute(item) + ITEM_GAP_MINUTES,
      );
      continue;
    }

    flushCluster();
    cluster = [item];
    clusterEnd = getRenderedEndMinute(item) + ITEM_GAP_MINUTES;
  }

  flushCluster();

  return positioned;
}

export function DayTimeline({
  title,
  items,
  highlights = [],
  startHour = 8,
  endHour = 21,
  onAddRecommendation,
  onIgnoreRecommendation,
  onSelectEvent,
}: DayTimelineProps) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? THEME.dark : THEME.light;
  const totalHours = endHour - startHour + 1;
  const timelineHeight = totalHours * HOUR_HEIGHT;
  const hours = Array.from(
    { length: totalHours },
    (_, index) => startHour + index,
  );
  const positionedItems = useMemo(() => positionItems(items), [items]);
  const rhythmSegments = useMemo(
    () => buildRhythmSegments(highlights, startHour * 60, endHour * 60),
    [endHour, highlights, startHour],
  );
  const contentHeight = useMemo(
    () =>
      Math.max(
        timelineHeight,
        ...positionedItems.map((item) => {
          const top = ((item.startMinute - startHour * 60) / 60) * HOUR_HEIGHT;
          return top + getRenderedItemHeight(item) + 16;
        }),
      ),
    [positionedItems, startHour, timelineHeight],
  );

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-foreground">{title}</Text>
      </View>

      <View className="rounded-[28px] border border-border bg-card px-4 py-4">
        <View className="flex-row gap-3">
          <View className="w-14 pt-2">
            {hours.map((hour) => (
              <View key={hour} style={{ height: HOUR_HEIGHT }}>
                <Text className="text-xs font-medium uppercase tracking-[1.6px] text-muted-foreground">
                  {formatHour(hour)}
                </Text>
              </View>
            ))}
          </View>

          <View className="w-2" style={{ height: timelineHeight }}>
            {rhythmSegments.map((segment) => {
              const top =
                ((segment.startMinute - startHour * 60) / 60) * HOUR_HEIGHT;
              const height =
                ((segment.endMinute - segment.startMinute) / 60) * HOUR_HEIGHT;

              return (
                <View
                  key={segment.id}
                  className={cn(
                    "absolute left-0 right-0 rounded-full",
                    segment.kind === "focus" ? "bg-primary" : "bg-secondary",
                  )}
                  style={{ top, height: Math.max(height - 4, 8) }}
                />
              );
            })}
          </View>

          <View className="flex-1" style={{ height: contentHeight }}>
            {hours.map((hour, index) => (
              <Fragment key={hour}>
                <View
                  className={cn(
                    "absolute left-0 right-0 border-t border-dashed border-border/70",
                    index === 0 && "border-t-0",
                  )}
                  style={{ top: index * HOUR_HEIGHT }}
                />
              </Fragment>
            ))}

            {positionedItems.map((item) => {
              const top =
                ((item.startMinute - startHour * 60) / 60) * HOUR_HEIGHT;
              const height = getRenderedItemHeight(item);
              const widthPercent = 100 / item.laneCount;
              const laneWidthPercent =
                item.laneCount > 1 ? widthPercent - 1.5 : widthPercent;
              const isCompact = item.laneCount > 1;
              const titleLineCount = item.kind === "event" && isCompact ? 2 : 3;
              const cardClassName = cn(
                "absolute left-0 right-0 rounded-3xl border px-4 py-4",
                item.kind === "event" && "active:opacity-80",
                accentClassMap[item.accent],
                item.kind === "recommendation" &&
                  item.status === "pending" &&
                  "border-dashed",
              );
              const cardStyle: ViewStyle = {
                top,
                height,
                width: `${laneWidthPercent}%` as `${number}%`,
                left: `${item.lane * widthPercent}%` as `${number}%`,
              };
              const cardContent = (
                <View className="gap-2">
                  <View
                    className={cn(
                      isCompact
                        ? "gap-2"
                        : "flex-row items-start justify-between gap-2",
                    )}
                  >
                    <Badge
                      variant="outline"
                      className="self-start bg-secondary/80 px-3 py-1"
                    >
                      <Text numberOfLines={1}>{item.badgeLabel}</Text>
                    </Badge>
                    <View
                      className={cn(
                        "min-w-0 flex-1 gap-1",
                        isCompact ? "items-start" : "items-end",
                      )}
                    >
                      {item.metaLabel ? (
                        <Text
                          className={cn(
                            "text-xs uppercase tracking-[1.3px] text-muted-foreground",
                            !isCompact && "text-right",
                          )}
                          numberOfLines={isCompact ? 2 : 1}
                        >
                          {item.metaLabel}
                        </Text>
                      ) : null}
                      <View className="flex-row items-center gap-1">
                        {item.kind === "recommendation" ? (
                          <Ionicons
                            name={
                              item.status === "accepted"
                                ? "sparkles"
                                : "add-circle-outline"
                            }
                            size={16}
                            color="#71717a"
                          />
                        ) : (
                          <Ionicons
                            name="calendar-outline"
                            size={16}
                            color="#71717a"
                          />
                        )}
                        <Text className="text-xs font-medium uppercase tracking-[1.2px] text-muted-foreground">
                          {formatClock(item.startMinute)}
                        </Text>
                        {item.kind === "event" ? (
                          <Ionicons
                            name="chevron-forward"
                            size={14}
                            color="#71717a"
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>

                  <Text
                    className={cn(
                      "font-semibold text-foreground",
                      item.kind === "event" && isCompact
                        ? "text-sm leading-4"
                        : "text-base leading-5",
                    )}
                    numberOfLines={titleLineCount}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>

                  {item.kind === "recommendation" ? (
                    item.status === "accepted" ? (
                      <Badge className="self-start bg-primary">
                        <Text>Added</Text>
                      </Badge>
                    ) : (
                      <View
                        className={cn(
                          "gap-2",
                          isCompact ? "flex-row" : "flex-col",
                        )}
                      >
                        <Button
                          accessibilityLabel="Ignore recommendation"
                          size="sm"
                          variant="outline"
                          className="h-9 w-9 px-0"
                          onPress={() => onIgnoreRecommendation?.(item.id)}
                        >
                          <Trash2
                            size={17}
                            strokeWidth={2.3}
                            color={theme.mutedForeground}
                          />
                        </Button>
                        <Button
                          accessibilityLabel="Add recommendation"
                          size="sm"
                          className="h-9 w-9 px-0"
                          onPress={() => onAddRecommendation?.(item.id)}
                        >
                          <Plus
                            size={17}
                            strokeWidth={2.6}
                            color={theme.primaryForeground}
                          />
                        </Button>
                      </View>
                    )
                  ) : null}
                </View>
              );

              return item.kind === "event" ? (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  className={cardClassName}
                  style={cardStyle}
                  onPress={() => onSelectEvent?.(item.id)}
                >
                  {cardContent}
                </Pressable>
              ) : (
                <View key={item.id} className={cardClassName} style={cardStyle}>
                  {cardContent}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

export type { DayTimelineHighlight, DayTimelineItem };
