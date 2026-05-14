import { Context } from "hono";
import { type } from "arktype";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "@/lib/cookie";
import { signInSchema } from "../schemas/signInSchema";
import { login } from "../services/login";

export const loginController = async (c: Context) => {
  const body = await c.req.json();
  const out = signInSchema(body);

  if (out instanceof type.errors) {
    throw new AppError(ERROR_TYPES.VALIDATION_ERROR, out.summary, 400)
  }

  const data = await login(out);

  setCookie(c, 'access_token', data.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', data.refreshToken, cookieOptions)

  return c.json({ data: data.user })
}

