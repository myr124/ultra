import { StyleSheet, Text, View } from "react-native";

import type { CreateTaskInput } from "@ultra/shared";

import { SurfaceCard } from "@/src/components/SurfaceCard";
import { theme } from "@/src/constants/theme";

type BucketPreview = {
  bucket: CreateTaskInput["bucket"];
  headline: string;
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

const accentMap: Record<CreateTaskInput["bucket"], string> = {
  work: theme.colors.signal,
  fitness: theme.colors.moss,
  fun: theme.colors.accentWarm,
};

export function TaskBucketBoard({ buckets }: TaskBucketBoardProps) {
  return (
    <View style={styles.stack}>
      {buckets.map((bucket) => (
        <SurfaceCard key={bucket.bucket} accent={accentMap[bucket.bucket]}>
          <Text style={styles.bucketLabel}>{bucket.bucket}</Text>
          <Text style={styles.bucketHeadline}>{bucket.headline}</Text>
          <View style={styles.taskStack}>
            {bucket.tasks.map((task) => (
              <View key={`${bucket.bucket}-${task.title}`} style={styles.taskRow}>
                <View style={styles.taskMeta}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDetails}>
                    {task.durationMin} min · {task.effort} effort
                  </Text>
                </View>
                <Text style={styles.taskStatus}>{task.status}</Text>
              </View>
            ))}
          </View>
        </SurfaceCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 12,
  },
  bucketLabel: {
    color: theme.colors.inkMuted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  bucketHeadline: {
    color: theme.colors.ink,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: "700",
    marginBottom: 14,
  },
  taskStack: {
    gap: 12,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.stroke,
  },
  taskMeta: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  taskDetails: {
    color: theme.colors.inkMuted,
    fontSize: 14,
  },
  taskStatus: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "capitalize",
  },
});
