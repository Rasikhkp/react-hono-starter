import type { Context } from "hono";

export const getMeController = (c: Context) => {
  return c.json({ data: c.get("user") });
};
