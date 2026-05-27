import { Context } from "hono";
import { editRoleSchema } from "../schemas/editRoleSchema";
import { editRole } from "../services/editRole";
import { validateData } from "@/lib/validateData";

export const editRoleController = async (c: Context) => {
  const body = await c.req.json();
  const id = c.req.param("id");
  const validated = validateData({ id, ...body }, editRoleSchema);
  await editRole(validated);
  return c.json({ data: null });
};
