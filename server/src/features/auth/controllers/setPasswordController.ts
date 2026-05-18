import type { Context } from "hono";
import { validateData } from "@/lib/validateData";
import { setPasswordSchema } from "../schemas/setPasswordSchema";
import { setPasswordForUser } from "../services/setPasswordForUser";

export const setPasswordController = async (c: Context) => {
  const body = await c.req.json();
  const validated = validateData(body, setPasswordSchema);

  const userId = c.get("user").id;
  const user = await setPasswordForUser(userId, validated.password);

  return c.json({ data: user });
};
