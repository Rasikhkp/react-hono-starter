import { Context } from "hono";
import { deleteUserSchema } from "../schemas/deleteUserSchema";
import { deleteUser } from "../services/deleteUser";
import { validateData } from "@/lib/validateData";

export const deleteUserController = async (c: Context) => {
  const id = c.req.param('id')
  const validated = validateData({ id }, deleteUserSchema)

  await deleteUser(validated);

  return c.json({ data: null });
}
