import * as authService from "./auth.service";
import * as authSchema from "./auth.schema";
import { Context } from "hono";
import { type } from "arktype";
import { AppError, ERROR_CODES } from "../../utils/error";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { cookieOptions } from "../../utils/cookie";

const register = async (c: Context) => {
  const body = await c.req.json();
  const out = authSchema.RegisterSchema(body);

  if (out instanceof type.errors) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, out.summary, 400)
  }

  await authService.register(out);

  return c.json({ data: null });
}

const login = async (c: Context) => {
  const body = await c.req.json();
  const out = authSchema.LoginSchema(body);

  if (out instanceof type.errors) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, out.summary, 400)
  }

  const tokens = await authService.login(out);

  setCookie(c, 'access_token', tokens.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', tokens.refreshToken, cookieOptions)

  return c.json({ data: null })
}

const refresh = async (c: Context) => {
  const { refreshToken } = await c.req.json();

  if (!refreshToken) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Refresh token is required", 400)
  }

  const tokens = await authService.refresh(refreshToken);

  setCookie(c, 'access_token', tokens.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', tokens.refreshToken, cookieOptions)

  return c.json({ data: null })
}

const logout = async (c: Context) => {
  const cookies = getCookie(c);

  if (cookies.refresh_token) {
    await authService.logout(cookies.refresh_token)
  }

  deleteCookie(c, 'access_cookie', cookieOptions)
  deleteCookie(c, 'refresh_token', cookieOptions)

  return c.json({ data: null })
}

export { register, login, refresh, logout }
