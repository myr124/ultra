import { View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import type { RecommendationPreview } from "@/src/lib/mock-dashboard";

type RecommendationCardProps = {
  recommendation: RecommendationPreview;
};

const accentMap: Record<RecommendationPreview["type"], "primary" | "accent" | "foreground"> = {
  focus_block: "primary",
  recovery_break: "accent",
  fitness_slot: "foreground",
  fun_slot: "foreground",
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <SurfaceCard accent={accentMap[recommendation.type]}>
      <CardHeader className="gap-3 px-5 py-5">
        <View className="flex-row items-center justify-between gap-3">
          <Badge variant="outline" className="border-border bg-secondary">
            <Text>{recommendation.type.replaceAll("_", " ")}</Text>
          </Badge>
          <Text className="text-muted-foreground text-sm">{recommendation.timeRange}</Text>
        </View>
        <CardTitle className="text-2xl leading-7">{recommendation.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Text className="text-muted-foreground leading-5">{recommendation.rationale[0]}</Text>
      </CardContent>
    </SurfaceCard>
  );
}
