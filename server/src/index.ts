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
import { roleRoutes } from "./features/role/routes";
import { permissionRoutes } from "./features/permission/routes";
import type { AuthUser } from "./lib/authUser";
import { unlinkGoogleController } from "./features/auth/controllers/unlinkGoogleController";
import { updateProfileController } from "./features/user/controllers/updateProfileController";
import { serveStatic } from "hono/bun";

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

app.use(
  "/uploads/*",
  serveStatic({
    root: "./uploads",
    rewriteRequestPath: (path) => {
      return path.replace("/uploads", "");
    },
  })
);

//-------------------------------
// Public API
//-------------------------------
const publicApi = new Hono<{ Variables: Variables }>();

publicApi.route("/auth", authRoutes);

app.get("/docs", Scalar({ url: "/openapi.json" }));
app.get("/openapi.json", (c) => c.json(openapi));

//-------------------------------
// Protected API
//-------------------------------
const protectedApi = new Hono<{ Variables: Variables }>();

protectedApi.use("*", authMiddleware);

protectedApi.get("/me", (c) => c.json({ data: c.get("user") }));

protectedApi.patch("/me", updateProfileController);

protectedApi.post("/auth/logout", logoutController);
protectedApi.post("/auth/unlink-google", unlinkGoogleController);
protectedApi.route("/", userRoutes);
protectedApi.route("/", roleRoutes);
protectedApi.route("/", permissionRoutes);

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
