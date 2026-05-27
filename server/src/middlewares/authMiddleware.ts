import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verifyAccessToken } from "../lib/jwt";
import { AppError, ERROR_TYPES } from "../lib/error";
import { getAuthUser } from "@/features/auth/services/getAuthUser";

export const authMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, "access_token");

  if (!token) {
    throw new AppError(ERROR_TYPES.UNAUTHORIZED, "Missing access token", 401);
  }

  try {
    const payload = await verifyAccessToken(token);

    const authUser = await getAuthUser(payload.payload.sub || '0')

    c.set('user', authUser)

    await next();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Invalid or expired access token",
      401,
    );
  }
};
