import { env } from "../env";

export const authConfig = {
  baseURL: env.BETTER_AUTH_URL,
  secretConfigured: Boolean(env.BETTER_AUTH_SECRET),
};
