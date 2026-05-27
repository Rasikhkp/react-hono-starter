import { Context } from "hono";
import { getPermissions } from "../services/getPermissions";

export const getPermissionsController = async (c: Context) => {
  const permissions = await getPermissions();
  return c.json({ data: permissions });
};
