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
import { mvpPreview, type RecommendationPreview } from "@/src/lib/mock-dashboard";

const recommendationLabelMap: Record<RecommendationPreview["type"], string> = {
  focus_block: "Focus block",
  recovery_break: "Recovery break",
  fitness_slot: "Fitness slot",
  fun_slot: "Fun slot",
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

export default function RecommendationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const recommendation = useMemo(
    () => mvpPreview.recommendations.find((entry) => entry.id === id),
    [id],
  );

  const nearbyEvents = useMemo(() => {
    if (!recommendation) {
      return [];
    }

    return mvpPreview.calendarEvents.filter(
      (event) =>
        event.startMinute < recommendation.endMinute + 30 &&
        recommendation.startMinute - 30 < event.endMinute,
    );
  }, [recommendation]);

  if (!recommendation) {
    return (
      <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
        <Button variant="ghost" className="self-start px-0" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color="#71717a" />
          <Text>Timeline</Text>
        </Button>

        <SurfaceCard accent="destructive">
          <CardContent className="gap-3 px-5 py-5">
            <Badge variant="outline" className="self-start bg-secondary">
              <Text>Recommendation</Text>
            </Badge>
            <CardTitle className="text-2xl leading-8">Recommendation not found</CardTitle>
            <Text className="leading-5 text-muted-foreground">
              This recommendation is not available in the current preview data.
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
        <Text>Timeline</Text>
      </Button>

      <SurfaceCard accent="primary">
        <CardHeader className="gap-3 px-5 py-5">
          <View className="flex-row items-start justify-between gap-3">
            <Badge variant="outline" className="bg-secondary">
              <Text>{recommendationLabelMap[recommendation.type]}</Text>
            </Badge>
            <Badge className="bg-primary">
              <Text>Added</Text>
            </Badge>
          </View>
          <CardTitle className="text-3xl leading-9">{recommendation.title}</CardTitle>
          <Text className="text-base font-semibold text-primary">{recommendation.timeRange}</Text>
        </CardHeader>
        <CardContent className="gap-4 px-5 pb-5">
          <Separator />

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl border border-border bg-secondary/40 px-4 py-4">
              <Text className="text-xs uppercase tracking-[1.4px] text-muted-foreground">Duration</Text>
              <Text className="mt-1 text-xl font-semibold text-foreground">
                {formatDuration(recommendation.startMinute, recommendation.endMinute)}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl border border-border bg-secondary/40 px-4 py-4">
              <Text className="text-xs uppercase tracking-[1.4px] text-muted-foreground">Status</Text>
              <Text className="mt-1 text-xl font-semibold text-foreground">Added</Text>
            </View>
          </View>
        </CardContent>
      </SurfaceCard>

      <SurfaceCard accent="accent">
        <CardHeader className="gap-2 px-5 py-5">
          <CardTitle className="text-2xl">Why this placement</CardTitle>
        </CardHeader>
        <CardContent className="gap-3 px-5 pb-5">
          {recommendation.rationale.map((reason) => (
            <View key={reason} className="flex-row gap-3 rounded-2xl border border-border bg-background px-4 py-3">
              <Ionicons name="sparkles" size={18} color="#71717a" />
              <Text className="min-w-0 flex-1 leading-5 text-muted-foreground">{reason}</Text>
            </View>
          ))}
        </CardContent>
      </SurfaceCard>

      <SurfaceCard accent={nearbyEvents.length > 0 ? "foreground" : "muted"}>
        <CardHeader className="gap-2 px-5 py-5">
          <View className="flex-row items-center justify-between gap-3">
            <CardTitle className="text-2xl">Calendar context</CardTitle>
            <Badge variant="outline" className="bg-secondary">
              <Text>{nearbyEvents.length} nearby</Text>
            </Badge>
          </View>
        </CardHeader>
        <CardContent className="gap-3 px-5 pb-5">
          {nearbyEvents.length > 0 ? (
            nearbyEvents.map((event) => (
              <View key={event.id} className="gap-1 rounded-2xl border border-border bg-background px-4 py-3">
                <Text className="font-semibold text-foreground">{event.title}</Text>
                <Text className="text-sm text-muted-foreground">{event.timeRange}</Text>
              </View>
            ))
          ) : (
            <Text className="leading-5 text-muted-foreground">
              No calendar events are close enough to constrain this placement.
            </Text>
          )}
        </CardContent>
      </SurfaceCard>
    </ScrollView>
  );
}
