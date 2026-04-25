import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SlidingTimeline } from "@/src/components/SlidingTimeline";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { ThemeToggleButton } from "@/src/components/ThemeToggleButton";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function CalendarScreen() {
  const focusBlock = mvpPreview.recommendations.find((entry) => entry.type === "focus_block");
  const focusSummary = focusBlock ? focusBlock.timeRange : "Not placed";

  return (
    <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
      <View className="flex-row items-start justify-between gap-4">
        <View className="gap-2">
          <Badge variant="outline" className="self-start bg-secondary">
            <Text>Calendar</Text>
          </Badge>
          <Text className="text-4xl font-bold tracking-tight text-foreground">Clear slots.</Text>
        </View>
        <ThemeToggleButton />
      </View>

      <SurfaceCard accent="primary">
        <CardHeader className="gap-2 px-5 py-5">
          <Text className="text-xs uppercase tracking-[1.6px] text-muted-foreground">Focus</Text>
          <CardTitle className="text-3xl">{focusSummary}</CardTitle>
        </CardHeader>
      </SurfaceCard>

      <SlidingTimeline title="Today" items={mvpPreview.timeline} />

      <View className="gap-3">
        {mvpPreview.calendarEvents.map((event) => (
          <SurfaceCard key={event.id} accent="muted">
            <CardContent className="px-5 py-5">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text className="text-xs uppercase tracking-[1.4px] text-primary">{event.timeRange}</Text>
                  <Text className="text-lg font-semibold text-foreground">{event.title}</Text>
                </View>
                <Badge variant="outline" className="bg-secondary">
                  <Text>{event.provider}</Text>
                </Badge>
              </View>
            </CardContent>
          </SurfaceCard>
        ))}
      </View>
    </ScrollView>
  );
}
