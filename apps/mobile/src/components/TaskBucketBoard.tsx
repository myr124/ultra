import { View } from "react-native";

import type { CreateTaskInput } from "@ultra/shared";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/src/components/SurfaceCard";

type BucketPreview = {
  bucket: CreateTaskInput["bucket"];
  tasks: Array<{
    title: string;
    durationMin: number;
    effort: CreateTaskInput["effort"];
    status: CreateTaskInput["status"];
  }>;
};

type TaskBucketBoardProps = {
  buckets: BucketPreview[];
};

const accentMap: Record<CreateTaskInput["bucket"], "primary" | "accent" | "foreground"> = {
  work: "primary",
  fitness: "accent",
  fun: "foreground",
};

export function TaskBucketBoard({ buckets }: TaskBucketBoardProps) {
  return (
    <View className="gap-3">
      {buckets.map((bucket) => (
        <SurfaceCard key={bucket.bucket} accent={accentMap[bucket.bucket]}>
          <CardHeader className="px-5 py-5">
            <Badge variant="outline" className="self-start bg-secondary">
              <Text>{bucket.bucket}</Text>
            </Badge>
          </CardHeader>
          <CardContent className="gap-3 px-5 pb-5">
            {bucket.tasks.map((task, index) => (
              <View key={`${bucket.bucket}-${task.title}`}>
                {index > 0 ? <Separator className="mb-3" /> : null}
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <Text className="text-base font-semibold text-foreground">{task.title}</Text>
                    <Text className="text-muted-foreground text-sm">
                      {task.durationMin} min · {task.effort} effort
                    </Text>
                  </View>
                  <Badge variant={task.status === "scheduled" ? "default" : "secondary"}>
                    <Text>{task.status}</Text>
                  </Badge>
                </View>
              </View>
            ))}
          </CardContent>
        </SurfaceCard>
      ))}
    </View>
  );
}
