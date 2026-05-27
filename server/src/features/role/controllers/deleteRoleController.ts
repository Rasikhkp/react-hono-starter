import { Context } from "hono";
import { deleteRoleSchema } from "../schemas/deleteRoleSchema";
import { deleteRole } from "../services/deleteRole";
import { validateData } from "@/lib/validateData";

export const deleteRoleController = async (c: Context) => {
  const id = c.req.param("id");
  const validated = validateData({ id }, deleteRoleSchema);
  await deleteRole(validated);
  return c.json({ data: null });
};
