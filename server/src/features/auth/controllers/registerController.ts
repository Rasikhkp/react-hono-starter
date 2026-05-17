import { Context } from "hono";
import { signUpSchema } from "../schemas/signUpSchema";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "@/lib/cookie";
import { register } from "../services/register";
import { validateData } from "@/lib/validateData";

export const registerController = async (c: Context) => {
  const body = await c.req.json();
  const validated = validateData(body, signUpSchema)

  const data = await register(validated);

  setCookie(c, 'access_token', data.accessToken, cookieOptions)
  setCookie(c, 'refresh_token', data.refreshToken, cookieOptions)

  return c.json({ data: data.user });
}
