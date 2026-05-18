import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "@/lib/cookie";
import { validateData } from "@/lib/validateData";
import { googleSignInSchema } from "../schemas/googleSignInSchema";
import { signInWithGoogle } from "../services/googleSignIn";

export const googleSignInController = async (c: Context) => {
  const body = await c.req.json();
  const validated = validateData(body, googleSignInSchema);

  const result = await signInWithGoogle(validated.code);

  setCookie(c, "access_token", result.accessToken, cookieOptions);
  setCookie(c, "refresh_token", result.refreshToken, cookieOptions);

  return c.json({ data: result.user });
};
