import { Context } from "hono";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "@/lib/cookie";
import { refresh } from "../services/refresh";

export const refreshController = async (c: Context) => {
  const { refreshToken } = await c.req.json();

  if (!refreshToken) {
    throw new AppError(ERROR_TYPES.VALIDATION_ERROR, "Refresh token is required", 400)
  }

  const tokens = await refresh(refreshToken);

  setCookie(c, 'access_token', tokens.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', tokens.refreshToken, cookieOptions)

  return c.json({ data: null })
}
