import type { inferAsyncReturnType } from "@trpc/server";

import { authConfig } from "./lib/auth";
import { db } from "./lib/db";

export async function createContext() {
  return {
    auth: authConfig,
    db,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
