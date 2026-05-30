import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { Scalar } from "@scalar/hono-api-reference";
import { env } from "@/config/env";
import { AppError, ERROR_TYPES } from "./lib/error";
import { createPublicApi, createProtectedApi } from "./routes";
import openapi from "../openapi.json";

const app = new Hono();

app.use(logger());

app.use(
  "*",
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  "/uploads/*",
  serveStatic({
    root: "./uploads",
    rewriteRequestPath: (path) => {
      return path.replace("/uploads", "");
    },
  })
);

app.get("/docs", Scalar({ url: "/openapi.json" }));
app.get("/openapi.json", (c) => c.json(openapi));

app.get("/", (c) => c.text("OK"));

app.route("/api", createPublicApi());
app.route("/api", createProtectedApi());

app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(
      {
        data: null,
        error: {
          type: err.code,
          message: err.message,
        },
      },
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
      },
    },
    500
  );
});

export default {
  port: 4000,
  fetch: app.fetch,
};
