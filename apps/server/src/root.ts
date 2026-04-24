import { biometricsRouter } from "./routers/biometrics";
import { energyRouter } from "./routers/energy";
import { healthRouter } from "./routers/health";
import { profileRouter } from "./routers/profile";
import { recommendationsRouter } from "./routers/recommendations";
import { tasksRouter } from "./routers/tasks";
import { router } from "./trpc";

export const appRouter = router({
  health: healthRouter,
  profile: profileRouter,
  tasks: tasksRouter,
  biometrics: biometricsRouter,
  energy: energyRouter,
  recommendations: recommendationsRouter,
});

export type AppRouter = typeof appRouter;
