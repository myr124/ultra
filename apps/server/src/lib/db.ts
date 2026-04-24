import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { env } from "../env";
import { PrismaClient } from "../generated/prisma/client";

declare global {
  var __ultraPrisma: PrismaClient | undefined;
}

const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL });

export const db = globalThis.__ultraPrisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.__ultraPrisma = db;
}
