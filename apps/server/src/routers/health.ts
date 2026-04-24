import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const healthRouter = router({
  status: publicProcedure
    .input(z.void())
    .query(() => ({
      ok: true,
      service: "ultra-server",
      timestamp: new Date().toISOString(),
    })),
});
