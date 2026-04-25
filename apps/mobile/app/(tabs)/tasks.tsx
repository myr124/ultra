import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { RecommendationCard } from "@/src/components/RecommendationCard";
import { TaskBucketBoard } from "@/src/components/TaskBucketBoard";
import { ThemeToggleButton } from "@/src/components/ThemeToggleButton";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function TasksScreen() {
  return (
    <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
      <View className="flex-row items-start justify-between gap-4">
        <View className="gap-2">
          <Badge variant="outline" className="self-start bg-secondary">
            <Text>Tasks</Text>
          </Badge>
          <Text className="text-4xl font-bold tracking-tight text-foreground">Less drag.</Text>
        </View>
        <ThemeToggleButton />
      </View>

      <TaskBucketBoard buckets={mvpPreview.taskBuckets} />

      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-foreground">Suggested placements</Text>
        <Badge variant="outline">
          <Text>Advisory</Text>
        </Badge>
      </View>

      <View className="gap-3">
        {mvpPreview.recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </View>
    </ScrollView>
  );
}
