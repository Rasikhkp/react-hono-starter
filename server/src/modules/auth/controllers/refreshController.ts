import { Context } from "hono";
import { AppError, ERROR_TYPES } from "@/utils/error";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "@/utils/cookie";
import { refreshService } from "../services/refreshService";

export const refreshController = async (c: Context) => {
  const { refreshToken } = await c.req.json();

  if (!refreshToken) {
    throw new AppError(ERROR_TYPES.VALIDATION_ERROR, "Refresh token is required", 400)
  }

  const tokens = await refreshService(refreshToken);

  setCookie(c, 'access_token', tokens.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', tokens.refreshToken, cookieOptions)

  return c.json({ data: null })
}
