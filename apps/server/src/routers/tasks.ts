import { createTaskInput } from "@ultra/shared";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

const seedTasks = [
  {
    id: "task-deep-work",
    title: "Draft energy engine heuristics",
    bucket: "work",
    durationMin: 90,
    effort: "high",
    flexibility: "moveable",
    status: "todo",
  },
];

export const tasksRouter = router({
  list: publicProcedure.query(() => seedTasks),
  create: publicProcedure.input(createTaskInput).mutation(({ input }) => ({
    id: "task-seeded",
    ...input,
  })),
  byBucket: publicProcedure
    .input(
      z.object({
        bucket: z.enum(["work", "fitness", "fun"]),
      }),
    )
    .query(({ input }) => seedTasks.filter((task) => task.bucket === input.bucket)),
});
