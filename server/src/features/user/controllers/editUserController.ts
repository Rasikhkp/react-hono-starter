import { Context } from "hono";
import { editUserSchema } from "../schemas/editUserSchema";
import { editUser } from "../services/editUser";
import { validateData } from "@/lib/validateData";

export const editUserController = async (c: Context) => {
  const body = await c.req.json();
  const id = c.req.param('id')
  const validated = validateData({ id, ...body }, editUserSchema)
  await editUser(validated);

  return c.json({ data: null });
}
