import { publicProcedure, router } from "../trpc";

export const profileRouter = router({
  getMe: publicProcedure.query(() => ({
    id: "seed-user",
    email: "alpha@ultra.local",
    authReady: false,
  })),
});
