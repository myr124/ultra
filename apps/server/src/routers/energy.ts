import { createEnergyState } from "@ultra/shared";

import { publicProcedure, router } from "../trpc";
import { computeMockEnergyTimeline } from "../services/energy-engine";

export const energyRouter = router({
  getLatestState: publicProcedure.query(() =>
    createEnergyState({
      timestamp: new Date().toISOString(),
      circadianBaseline: 83,
      ultradianPhase: "peak",
      compositeIndex: 78,
      sleepPressure: 29,
      redline: false,
      confidence: 0.88,
    }),
  ),
  getTodayTimeline: publicProcedure.query(() => computeMockEnergyTimeline()),
});
