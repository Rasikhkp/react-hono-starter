import { Context } from "hono";
import { deleteUsersSchema } from "../schemas/deleteUsersSchema";
import { deleteUsers } from "../services/deleteUsers";
import { validateData } from "@/lib/validateData";

export const deleteUsersController = async (c: Context) => {
  const body = await c.req.json();
  const validated = validateData(body, deleteUsersSchema)
  await deleteUsers(validated);

  return c.json({ data: null });
}
