import { Context } from "hono";
import { getRoles } from "../services/getRoles";

export const getRolesController = async (c: Context) => {
  const roles = await getRoles();
  return c.json({ data: roles });
};
