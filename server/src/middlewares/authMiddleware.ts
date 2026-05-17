import { Context, Next } from "hono";
import { verifyAccessToken } from "../lib/jwt"; // you should have this
import { AppError, ERROR_TYPES } from "../lib/error";
import { getCookie } from "hono/cookie";
import { db } from "../db/database";

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

    const user = await db
      .selectFrom("users")
      .select(["id", "name", "email", "isActive", "isEmailVerified"])
      .where("id", "=", payload.payload.sub || '0')
      .executeTakeFirst();

    if (!user) {
      throw new AppError(
        ERROR_TYPES.UNAUTHORIZED,
        "User not found",
        401
      );
    }

    c.set("user", user);

    await next();
  } catch (err) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Invalid or expired access token",
      401
    );
  }
};
