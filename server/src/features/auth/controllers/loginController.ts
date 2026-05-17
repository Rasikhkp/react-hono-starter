import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "@/lib/cookie";
import { signInSchema } from "../schemas/signInSchema";
import { login } from "../services/login";
import { validateData } from "@/lib/validateData";

export const loginController = async (c: Context) => {
  const body = await c.req.json()
  const validated = validateData(body, signInSchema);

  const result = await login(validated);

  setCookie(c, 'access_token', result.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', result.refreshToken, cookieOptions)

  return c.json({ data: result.user })
}

