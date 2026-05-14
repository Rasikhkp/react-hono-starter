import { CookieOptions } from "hono/utils/cookie";
import { env } from "../config/env";

const isProd = env.ENV === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "Lax" : "Lax",
  path: "/",
};
