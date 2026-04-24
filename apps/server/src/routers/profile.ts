import { updatePreferencesInput } from "@ultra/shared";

import { getCurrentUser } from "../lib/current-user";
import { mapPreferences, mapProfile } from "../lib/mappers";
import { publicProcedure, router } from "../trpc";

export const profileRouter = router({
  getMe: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser(ctx.db);
    return mapProfile(user);
  }),
  updatePreferences: publicProcedure.input(updatePreferencesInput).mutation(async ({ ctx, input }) => {
    const user = await getCurrentUser(ctx.db);

    const preferences = await ctx.db.userPreference.upsert({
      where: {
        userId: user.id,
      },
      update: input,
      create: {
        userId: user.id,
        chronotype: input.chronotype ?? null,
        wakeTime: input.wakeTime ?? null,
        notificationsOn: input.notificationsOn ?? true,
      },
    });

    return mapPreferences(preferences);
  }),
});
