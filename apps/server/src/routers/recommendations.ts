import { z } from "zod";

import { getCurrentUser } from "../lib/current-user";
import { mapRecommendation } from "../lib/mappers";
import { publicProcedure, router } from "../trpc";
import { generateRecommendations } from "../services/recommendation-engine";

export const recommendationsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          status: z.enum(["pending", "accepted", "dismissed"]).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      const recommendations = await ctx.db.recommendation.findMany({
        where: {
          userId: user.id,
          ...(input?.status ? { status: input.status } : {}),
        },
        orderBy: {
          startsAt: "asc",
        },
      });

      return recommendations.map(mapRecommendation);
    }),
  generate: publicProcedure
    .input(
      z
        .object({
          date: z.string().date().optional(),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      const date = input?.date ? new Date(`${input.date}T00:00:00.000Z`) : new Date();

      await ctx.db.recommendation.deleteMany({
        where: {
          userId: user.id,
          status: "pending",
        },
      });

      const recommendations = await generateRecommendations(ctx.db, user.id, date);
      return recommendations.map(mapRecommendation);
    }),
  accept: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      await ctx.db.recommendation.findFirstOrThrow({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      const recommendation = await ctx.db.recommendation.update({
        where: {
          id: input.id,
        },
        data: {
          status: "accepted",
        },
      });

      if (recommendation.taskId) {
        await ctx.db.task.findFirstOrThrow({
          where: {
            id: recommendation.taskId,
            userId: user.id,
          },
        });

        await ctx.db.task.update({
          where: {
            id: recommendation.taskId,
          },
          data: {
            status: "scheduled",
          },
        });
      }

      return mapRecommendation(recommendation);
    }),
  dismiss: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      await ctx.db.recommendation.findFirstOrThrow({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      const recommendation = await ctx.db.recommendation.update({
        where: {
          id: input.id,
        },
        data: {
          status: "dismissed",
        },
      });

      return mapRecommendation(recommendation);
    }),
});
