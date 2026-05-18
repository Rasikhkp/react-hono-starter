import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { db } from "../db/database";
import { verifyAccessToken } from "../lib/jwt";
import { AppError, ERROR_TYPES } from "../lib/error";
import { authUserFields, toAuthUser } from "../lib/authUser";

export const authMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, "access_token");

  if (!token) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Missing access token",
      401
    );
  }

  try {
    const payload = await verifyAccessToken(token);

    const row = await db
      .selectFrom("users")
      .select(authUserFields)
      .where("id", "=", payload.payload.sub || "0")
      .executeTakeFirst();

    if (!row) {
      throw new AppError(
        ERROR_TYPES.UNAUTHORIZED,
        "User not found",
        401
      );
    }

    c.set("user", toAuthUser(row));

    await next();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Invalid or expired access token",
      401
    );
  }
};
