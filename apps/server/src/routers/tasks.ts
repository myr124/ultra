import { createTaskInput } from "@ultra/shared";
import { z } from "zod";

import { getCurrentUser } from "../lib/current-user";
import { mapTask } from "../lib/mappers";
import { publicProcedure, router } from "../trpc";

export const tasksRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser(ctx.db);
    const tasks = await ctx.db.task.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return tasks.map(mapTask);
  }),
  create: publicProcedure.input(createTaskInput).mutation(async ({ ctx, input }) => {
    const user = await getCurrentUser(ctx.db);
    const task = await ctx.db.task.create({
      data: {
        userId: user.id,
        ...input,
      },
    });

    return mapTask(task);
  }),
  update: publicProcedure
    .input(
      createTaskInput.partial().extend({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      const { id, ...data } = input;
      await ctx.db.task.findFirstOrThrow({
        where: {
          id,
          userId: user.id,
        },
      });

      const task = await ctx.db.task.update({
        where: {
          id,
        },
        data,
      });

      return mapTask(task);
    }),
  complete: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      await ctx.db.task.findFirstOrThrow({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      const task = await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          status: "done",
        },
      });

      return mapTask(task);
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      await ctx.db.task.findFirstOrThrow({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      await ctx.db.task.delete({
        where: {
          id: input.id,
        },
      });

      return { success: true };
    }),
  byBucket: publicProcedure
    .input(
      z.object({
        bucket: z.enum(["work", "fitness", "fun"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      const tasks = await ctx.db.task.findMany({
        where: {
          userId: user.id,
          bucket: input.bucket,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return tasks.map(mapTask);
    }),
});
