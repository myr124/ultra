import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import type { TimelineItem } from "@/src/lib/mock-dashboard";

type SlidingTimelineProps = {
  title: string;
  items: TimelineItem[];
};

const toneMap: Record<TimelineItem["tone"], "accent" | "primary" | "foreground"> = {
  peak: "accent",
  transition: "primary",
  trough: "foreground",
  event: "foreground",
};

export function SlidingTimeline({ title, items }: SlidingTimelineProps) {
  return (
    <View className="gap-3">
      <Text className="text-xl font-bold text-foreground">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pr-5">
        {items.map((item) => (
          <SurfaceCard key={item.id} accent={toneMap[item.tone]} className="w-60">
            <CardHeader className="gap-3 px-5 py-5">
              <Text className="text-muted-foreground text-xs uppercase tracking-[1.6px]">{item.time}</Text>
              <CardTitle className="text-2xl leading-7">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Badge variant="outline" className="bg-secondary self-start">
                <Text>{item.label}</Text>
              </Badge>
            </CardContent>
          </SurfaceCard>
        ))}
      </ScrollView>
    </View>
  );
}
