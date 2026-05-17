import { Context } from "hono";
import { createUser } from "../services/createUser";
import { createUserSchema } from "../schemas/createUserSchema";
import { validateData } from "@/lib/validateData";

export const createUserController = async (c: Context) => {
  const body = await c.req.json()
  const validated = validateData(body, createUserSchema);

  await createUser(validated);

  return c.json({ data: null });
}
