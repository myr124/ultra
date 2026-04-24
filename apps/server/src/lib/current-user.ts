import type { PrismaClient } from "../generated/prisma/client";

const DEFAULT_USER = {
  email: "alpha@ultra.local",
  name: "Ultra Alpha",
};

export async function getCurrentUser(db: PrismaClient) {
  return db.user.upsert({
    where: { email: DEFAULT_USER.email },
    update: {},
    create: DEFAULT_USER,
    include: {
      preferences: true,
    },
  });
}
