import { Hono } from "hono";
import { authRoutes } from "./modules/auth/routes";
import { AppError, ERROR_CODES } from "./utils/error";
import { authMiddleware } from "./middlewares/authMiddleware";
import { cors } from 'hono/cors'
import { User } from "./db/schema";
import { logoutController } from "./modules/auth/controllers/logoutController";
import { Scalar } from "@scalar/hono-api-reference";
import openapi from "../openapi.json";

type Variables = {
  user: User
};

const app = new Hono<{ Variables: Variables }>();

app.get('/scalar', Scalar({ url: '/doc' }))
app.get('/doc', (c) => c.json(openapi))

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

//-------------------------------
// Protected API
//-------------------------------
const protectedApi = new Hono<{ Variables: Variables }>();

protectedApi.use("*", authMiddleware);

protectedApi.get("/me", (c) => {
  const user = c.get("user");
  return c.json({ data: user });
});

protectedApi.post('/auth/logout', logoutController)

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
        error: {
          code: err.code,
          message: err.message,
        },
      },
      err.status
    );
  }

  console.error("Unhandled error:", err);

  return c.json(
    {
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: "Something went wrong",
      },
    },
    500
  );
});

export default {
  port: 4000,
  fetch: app.fetch,
};
