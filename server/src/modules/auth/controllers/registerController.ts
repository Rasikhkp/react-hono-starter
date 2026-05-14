import { Context } from "hono";
import { type } from "arktype";
import { AppError, ERROR_TYPES } from "@/utils/error";
import { registerService } from "../services/registerService";
import { signUpSchema } from "../schemas/signUpSchema";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "@/utils/cookie";

export const registerController = async (c: Context) => {
  const body = await c.req.json();
  const out = signUpSchema(body);

  if (out instanceof type.errors) {
    throw new AppError(ERROR_TYPES.VALIDATION_ERROR, out.summary, 400)
  }

  const data = await registerService(out);

  setCookie(c, 'access_token', data.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', data.refreshToken, cookieOptions)

  return c.json({ data: data.user });
}
