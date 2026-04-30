import { Fragment, useMemo } from "react";
import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
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

const HOUR_HEIGHT = 88;
const ITEM_GAP_MINUTES = 8;

const MIN_ITEM_HEIGHT: Record<DayTimelineItem["kind"], number> = {
  event: 96,
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
  const durationHeight = ((item.endMinute - item.startMinute) / 60) * HOUR_HEIGHT;
  return Math.max(durationHeight, getMinimumItemHeight(item));
}

function getRenderedEndMinute(item: DayTimelineItem) {
  return item.startMinute + (getRenderedItemHeight(item) / HOUR_HEIGHT) * 60;
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
      let lane = laneEndMinutes.findIndex((endMinute) => endMinute <= item.startMinute);

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
      clusterEnd = Math.max(clusterEnd, getRenderedEndMinute(item) + ITEM_GAP_MINUTES);
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
}: DayTimelineProps) {
  const totalHours = endHour - startHour + 1;
  const timelineHeight = totalHours * HOUR_HEIGHT;
  const hours = Array.from({ length: totalHours }, (_, index) => startHour + index);
  const positionedItems = useMemo(() => positionItems(items), [items]);
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
        <Text className="text-xl font-bold text-foreground">{title}</Text>
        <Badge variant="outline" className="bg-secondary">
          <Text>{items.length} blocks</Text>
        </Badge>
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

            {highlights.map((highlight) => {
              const top = ((highlight.startMinute - startHour * 60) / 60) * HOUR_HEIGHT;
              const height = ((highlight.endMinute - highlight.startMinute) / 60) * HOUR_HEIGHT;

              return (
                <View
                  key={highlight.id}
                  className="absolute left-0 right-0 overflow-hidden rounded-[24px] border border-primary/12 bg-primary/[0.06]"
                  style={{ top, height }}
                >
                  <View className="px-4 py-3">
                    <Text className="text-[10px] font-semibold uppercase tracking-[1.8px] text-primary/70">
                      {highlight.label}
                    </Text>
                  </View>
                </View>
              );
            })}

            {positionedItems.map((item) => {
              const top = ((item.startMinute - startHour * 60) / 60) * HOUR_HEIGHT;
              const height = getRenderedItemHeight(item);
              const widthPercent = 100 / item.laneCount;
              const laneWidthPercent = item.laneCount > 1 ? widthPercent - 1.5 : widthPercent;
              const isCompact = item.laneCount > 1;

              return (
                <View
                  key={item.id}
                  className={cn(
                    "absolute left-0 right-0 rounded-3xl border px-4 py-4",
                    accentClassMap[item.accent],
                    item.kind === "recommendation" && item.status === "pending" && "border-dashed",
                  )}
                  style={{
                    top,
                    height,
                    width: `${laneWidthPercent}%`,
                    left: `${item.lane * laneWidthPercent}%`,
                  }}
                >
                  <View className="gap-2">
                    <View className={cn(isCompact ? "gap-2" : "flex-row items-start justify-between gap-2")}>
                      <Badge variant="outline" className="self-start bg-secondary/80 px-3 py-1">
                        <Text numberOfLines={1}>{item.badgeLabel}</Text>
                      </Badge>
                      <View className={cn("min-w-0 flex-1 gap-1", isCompact ? "items-start" : "items-end")}>
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
                              name={item.status === "accepted" ? "sparkles" : "add-circle-outline"}
                              size={16}
                              color="#71717a"
                            />
                          ) : (
                            <Ionicons name="calendar-outline" size={16} color="#71717a" />
                          )}
                          <Text className="text-xs font-medium uppercase tracking-[1.2px] text-muted-foreground">
                            {formatClock(item.startMinute)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text className="text-base font-semibold leading-5 text-foreground" numberOfLines={3}>
                      {item.title}
                    </Text>

                    {item.kind === "recommendation" ? (
                      item.status === "accepted" ? (
                        <Badge className="self-start bg-primary">
                          <Text>Added</Text>
                        </Badge>
                      ) : (
                        <View className={cn("gap-2", isCompact ? "flex-col" : "flex-row")}>
                          <Button
                            size="sm"
                            variant="outline"
                            className={cn(isCompact ? "w-full" : "flex-1")}
                            onPress={() => onIgnoreRecommendation?.(item.id)}
                          >
                            <Text>Ignore</Text>
                          </Button>
                          <Button
                            size="sm"
                            className={cn(isCompact ? "w-full" : "flex-1")}
                            onPress={() => onAddRecommendation?.(item.id)}
                          >
                            <Text>Add</Text>
                          </Button>
                        </View>
                      )
                    ) : null}
                  </View>
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
