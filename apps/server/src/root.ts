import { energyRouter } from "./routers/energy";
import { healthRouter } from "./routers/health";
import { profileRouter } from "./routers/profile";
import { tasksRouter } from "./routers/tasks";
import { router } from "./trpc";

export const appRouter = router({
  health: healthRouter,
  profile: profileRouter,
  tasks: tasksRouter,
  energy: energyRouter,
});

export type AppRouter = typeof appRouter;
