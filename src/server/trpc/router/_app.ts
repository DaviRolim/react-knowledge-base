import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { storageRouter } from "./storage";

export const appRouter = router({
  example: exampleRouter,
  storage: storageRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
