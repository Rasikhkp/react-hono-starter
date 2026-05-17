import { Hono } from "hono";
import { authRoutes } from "./features/auth/routes";
import { AppError, ERROR_TYPES } from "./lib/error";
import { authMiddleware } from "./middlewares/authMiddleware";
import { cors } from 'hono/cors'
import { User } from "./db/schema";
import { logoutController } from "./features/auth/controllers/logoutController";
import { Scalar } from "@scalar/hono-api-reference";
import openapi from "../openapi.json";
import { logger } from "hono/logger";
import { userRoutes } from "./features/user/routes";

type Variables = {
  user: User
};

const app = new Hono<{ Variables: Variables }>();

app.use(logger())

app.use(
  '*',
  cors({
    origin: 'http://localhost:3000',
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

protectedApi.get("/me", (c) => {
  const user = c.get("user");

  console.log('user in me', user)
  return c.json({ data: user });
});

protectedApi.post('/auth/logout', logoutController)
protectedApi.route('/', userRoutes)

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
