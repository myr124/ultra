import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { EnergyAvatar } from "@/src/components/EnergyAvatar";
import { EnergyGauge } from "@/src/components/EnergyGauge";
import { RecommendationCard } from "@/src/components/RecommendationCard";
import { RecoveryPrompt } from "@/src/components/RecoveryPrompt";
import { SlidingTimeline } from "@/src/components/SlidingTimeline";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { ThemeToggleButton } from "@/src/components/ThemeToggleButton";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function TodayScreen() {
  const { energyState, avatarState, recommendations, timeline } = mvpPreview;

  return (
    <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
      <View className="flex-row items-start justify-between gap-4">
        <View className="gap-2">
          <Badge className="self-start">
            <Text>Today</Text>
          </Badge>
          <Text className="text-4xl font-bold tracking-tight text-foreground">Energy first.</Text>
        </View>
        <ThemeToggleButton />
      </View>

      <SurfaceCard accent="primary">
        <CardContent className="px-5 py-5">
          <View className="flex-row items-center gap-4">
            <EnergyAvatar state={avatarState} />
            <EnergyGauge energyState={energyState} />
          </View>
        </CardContent>
      </SurfaceCard>

      <RecoveryPrompt title="Walk in 18 min" body="Short reset before the dip." />

      <SlidingTimeline title="Flow" items={timeline} />

      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-foreground">Recommendations</Text>
        <Badge variant="outline">
          <Text>3 live</Text>
        </Badge>
      </View>

      <View className="gap-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </View>
    </ScrollView>
  );
}
