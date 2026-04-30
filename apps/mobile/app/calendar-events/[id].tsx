import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { mvpPreview, type CalendarEventPreview } from "@/src/lib/mock-dashboard";

const providerLabelMap: Record<CalendarEventPreview["provider"], string> = {
  google: "Google Calendar",
  apple: "Apple Calendar",
  outlook: "Outlook Calendar",
};

function formatDuration(startMinute: number, endMinute: number) {
  const duration = endMinute - startMinute;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

export default function CalendarEventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const event = useMemo(
    () => mvpPreview.calendarEvents.find((calendarEvent) => calendarEvent.id === id),
    [id],
  );

  const overlappingRecommendations = useMemo(() => {
    if (!event) {
      return [];
    }

    return mvpPreview.recommendations.filter(
      (recommendation) =>
        recommendation.startMinute < event.endMinute && event.startMinute < recommendation.endMinute,
    );
  }, [event]);

  if (!event) {
    return (
      <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
        <Button variant="ghost" className="self-start px-0" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color="#71717a" />
          <Text>Calendar</Text>
        </Button>

        <SurfaceCard accent="destructive">
          <CardContent className="gap-3 px-5 py-5">
            <Badge variant="outline" className="self-start bg-secondary">
              <Text>Event</Text>
            </Badge>
            <CardTitle className="text-2xl leading-8">Event not found</CardTitle>
            <Text className="leading-5 text-muted-foreground">
              This calendar block is not available in the current preview data.
            </Text>
          </CardContent>
        </SurfaceCard>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
      <Button variant="ghost" className="self-start px-0" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={18} color="#71717a" />
        <Text>Calendar</Text>
      </Button>

      <SurfaceCard accent="foreground">
        <CardHeader className="gap-3 px-5 py-5">
          <View className="flex-row items-start justify-between gap-3">
            <Badge variant="outline" className="bg-secondary">
              <Text>{providerLabelMap[event.provider]}</Text>
            </Badge>
            <Ionicons name="calendar-outline" size={22} color="#71717a" />
          </View>
          <CardTitle className="text-3xl leading-9">{event.title}</CardTitle>
          <Text className="text-base font-semibold text-primary">{event.timeRange}</Text>
        </CardHeader>
        <CardContent className="gap-4 px-5 pb-5">
          <Separator />

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl border border-border bg-secondary/40 px-4 py-4">
              <Text className="text-xs uppercase tracking-[1.4px] text-muted-foreground">Duration</Text>
              <Text className="mt-1 text-xl font-semibold text-foreground">
                {formatDuration(event.startMinute, event.endMinute)}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl border border-border bg-secondary/40 px-4 py-4">
              <Text className="text-xs uppercase tracking-[1.4px] text-muted-foreground">Source</Text>
              <Text className="mt-1 text-xl font-semibold text-foreground">{event.provider}</Text>
            </View>
          </View>
        </CardContent>
      </SurfaceCard>

      <SurfaceCard accent={overlappingRecommendations.length > 0 ? "primary" : "muted"}>
        <CardHeader className="gap-2 px-5 py-5">
          <View className="flex-row items-center justify-between gap-3">
            <CardTitle className="text-2xl">Scheduling impact</CardTitle>
            <Badge variant="outline" className="bg-secondary">
              <Text>{overlappingRecommendations.length} conflicts</Text>
            </Badge>
          </View>
        </CardHeader>
        <CardContent className="gap-3 px-5 pb-5">
          {overlappingRecommendations.length > 0 ? (
            overlappingRecommendations.map((recommendation) => (
              <View key={recommendation.id} className="gap-1 rounded-2xl border border-border bg-background px-4 py-3">
                <Text className="font-semibold text-foreground">{recommendation.title}</Text>
                <Text className="text-sm text-muted-foreground">{recommendation.timeRange}</Text>
              </View>
            ))
          ) : (
            <Text className="leading-5 text-muted-foreground">
              This event does not overlap any current recommendations.
            </Text>
          )}
        </CardContent>
      </SurfaceCard>
    </ScrollView>
  );
}
