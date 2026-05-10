import { Context, Next } from "hono";
import { verifyAccessToken } from "../utils/jwt"; // you should have this
import { AppError, ERROR_CODES } from "../utils/error";
import { getCookie } from "hono/cookie";
import { db } from "../db/database";

export const authMiddleware = async (c: Context, next: Next) => {
  const cookies = getCookie(c)

  if (!cookies.access_token) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      "Missing or invalid authorization header",
      401
    );
  }

  try {
    const payload = await verifyAccessToken(cookies.access_token);

    const user = await db.selectFrom('users').selectAll().where('id', '=', payload.payload.sub || '0').executeTakeFirst()

    c.set("user", user);

    await next();
  } catch (err) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      "Invalid or expired access token",
      401
    );
  }
};
