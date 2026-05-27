import { Context } from "hono";
import { createRole } from "../services/createRole";
import { createRoleSchema } from "../schemas/createRoleSchema";
import { validateData } from "@/lib/validateData";

export const createRoleController = async (c: Context) => {
  const body = await c.req.json();
  const validated = validateData(body, createRoleSchema);
  await createRole(validated);
  return c.json({ data: null });
};
