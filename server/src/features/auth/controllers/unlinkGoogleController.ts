import type { Context } from "hono";
import { unlinkGoogleForUser } from "../services/unlinkGoogleForUser";

export const unlinkGoogleController = async (c: Context) => {
  const userId = c.get("user").id;
  const user = await unlinkGoogleForUser(userId);

  return c.json({ data: user });
};
