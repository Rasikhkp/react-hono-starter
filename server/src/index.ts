import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "@/config/env";
import { authRoutes } from "./features/auth/routes";
import { AppError, ERROR_TYPES } from "./lib/error";
import { authMiddleware } from "./middlewares/authMiddleware";
import { logoutController } from "./features/auth/controllers/logoutController";
import { Scalar } from "@scalar/hono-api-reference";
import openapi from "../openapi.json";
import { logger } from "hono/logger";
import { userRoutes } from "./features/user/routes";
import type { AuthUser } from "./lib/authUser";
import { setPasswordController } from "./features/auth/controllers/setPasswordController";
import { unlinkGoogleController } from "./features/auth/controllers/unlinkGoogleController";
import { updateProfileController } from "./features/user/controllers/updateProfileController";

type Variables = {
  user: AuthUser;
};

const app = new Hono<{ Variables: Variables }>();

app.use(logger())

app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
)

//-------------------------------
// Public API
//-------------------------------
const publicApi = new Hono<{ Variables: Variables }>();

publicApi.route("/auth", authRoutes);

app.get('/scalar', Scalar({ url: '/doc' }))
app.get('/doc', (c) => c.json(openapi))

//-------------------------------
// Protected API
//-------------------------------
const protectedApi = new Hono<{ Variables: Variables }>();

protectedApi.use("*", authMiddleware);

protectedApi.get("/me", (c) => c.json({ data: c.get("user") }));

protectedApi.patch("/me", updateProfileController);

protectedApi.post("/auth/logout", logoutController);
protectedApi.post("/auth/set-password", setPasswordController);
protectedApi.post("/auth/unlink-google", unlinkGoogleController);
protectedApi.route("/", userRoutes);

//-------------------------------
// Root routes
//-------------------------------
app.get("/", (c) => c.text("OK"));

//-------------------------------
// Mount APIs
//-------------------------------
app.route("/api", publicApi);
app.route("/api", protectedApi);

//-------------------------------
// Global Error Handler
//-------------------------------
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(
      {
        data: null,
        error: {
          type: err.code,
          message: err.message,
        }
      }
      ,
      err.status
    );
  }

  console.error("Unhandled error:", err);

  return c.json(
    {
      data: null,
      error: {
        type: ERROR_TYPES.INTERNAL_ERROR,
        message: "Something went wrong",
      }
    },
    500
  );
});

export default {
  port: 4000,
  fetch: app.fetch,
};
