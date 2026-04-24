import { ingestBiometricSampleInput, biometricSampleTypeSchema } from "@ultra/shared";
import { z } from "zod";

import { getCurrentUser } from "../lib/current-user";
import { mapBiometricSample } from "../lib/mappers";
import { publicProcedure, router } from "../trpc";
import { computeEnergyState } from "../services/energy-engine";

export const biometricsRouter = router({
  ingestSample: publicProcedure.input(ingestBiometricSampleInput).mutation(async ({ ctx, input }) => {
    const user = await getCurrentUser(ctx.db);

    const sample = await ctx.db.biometricSample.create({
      data: {
        userId: user.id,
        source: input.source,
        type: input.type,
        value: String(input.value),
        unit: input.unit,
        recordedAt: new Date(input.recordedAt),
      },
    });

    const latestState = await computeEnergyState(ctx.db, user.id, new Date(input.recordedAt));

    return {
      sample: mapBiometricSample(sample),
      latestState,
    };
  }),
  listSamples: publicProcedure
    .input(
      z
        .object({
          type: biometricSampleTypeSchema.optional(),
          limit: z.number().int().positive().max(100).default(30),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const user = await getCurrentUser(ctx.db);
      const samples = await ctx.db.biometricSample.findMany({
        where: {
          userId: user.id,
          ...(input?.type ? { type: input.type } : {}),
        },
        orderBy: {
          recordedAt: "desc",
        },
        take: input?.limit ?? 30,
      });

      return samples.map(mapBiometricSample);
    }),
  getLatestState: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser(ctx.db);
    return computeEnergyState(ctx.db, user.id, new Date());
  }),
});
