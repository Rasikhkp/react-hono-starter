import { Context } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import { cookieOptions } from "@/lib/cookie";
import { logout } from "../services/logout";

export const logoutController = async (c: Context) => {
  const cookies = getCookie(c);

  if (cookies.refresh_token) {
    await logout(cookies.refresh_token)
  }

  deleteCookie(c, 'access_token', cookieOptions)
  deleteCookie(c, 'refresh_token', cookieOptions)

  return c.json({ data: null })
}


