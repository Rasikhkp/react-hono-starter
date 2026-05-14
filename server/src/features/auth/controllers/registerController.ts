import { Context } from "hono";
import { type } from "arktype";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { signUpSchema } from "../schemas/signUpSchema";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "@/lib/cookie";
import { register } from "../services/register";

export const registerController = async (c: Context) => {
  const body = await c.req.json();
  const out = signUpSchema(body);

  if (out instanceof type.errors) {
    throw new AppError(ERROR_TYPES.VALIDATION_ERROR, out.summary, 400)
  }

  const data = await register(out);

  setCookie(c, 'access_token', data.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', data.refreshToken, cookieOptions)

  return c.json({ data: data.user });
}
