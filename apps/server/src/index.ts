import { createHTTPServer } from "@trpc/server/adapters/standalone";

import { env } from "./env";
import { createContext } from "./context";
import { appRouter } from "./root";

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

server.listen(env.PORT);

console.log(`Ultra server listening on http://localhost:${env.PORT}`);
