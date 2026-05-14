import { Context, Next } from "hono";
import { verifyAccessToken } from "../lib/jwt"; // you should have this
import { AppError, ERROR_TYPES } from "../lib/error";
import { getCookie } from "hono/cookie";
import { db } from "../db/database";

export const authMiddleware = async (c: Context, next: Next) => {
  const cookies = getCookie(c)

  if (!cookies.access_token) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Missing or invalid authorization header",
      401
    );
  }

  try {
    const payload = await verifyAccessToken(cookies.access_token);

    const user = await db.selectFrom('users').select(['id', 'name', 'email', 'isActive', 'isEmailVerified']).where('id', '=', payload.payload.sub || '0').executeTakeFirst()

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
