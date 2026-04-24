import { z } from "zod";

import { getCurrentUser } from "../lib/current-user";
import { mapEnergySnapshot } from "../lib/mappers";
import { publicProcedure, router } from "../trpc";
import {
  computeEnergyState,
  computeEnergyTimeline,
  recomputeEnergyState,
} from "../services/energy-engine";

export const energyRouter = router({
  getLatestState: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser(ctx.db);
    const snapshot = await ctx.db.energySnapshot.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (snapshot) {
      return mapEnergySnapshot(snapshot);
    }

    return computeEnergyState(ctx.db, user.id, new Date());
  }),
  getTodayTimeline: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser(ctx.db);
    return computeEnergyTimeline(ctx.db, user.id, new Date());
  }),
  recompute: publicProcedure
    .input(
      z
        .object({
          at: z.string().datetime().optional(),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      const at = input?.at ? new Date(input.at) : new Date();
      return recomputeEnergyState(ctx.db, user.id, at);
    }),
  getSnapshots: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().positive().max(48).default(12),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      const snapshots = await ctx.db.energySnapshot.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          timestamp: "desc",
        },
        take: input?.limit ?? 12,
      });

      return snapshots.map(mapEnergySnapshot);
    }),
});
