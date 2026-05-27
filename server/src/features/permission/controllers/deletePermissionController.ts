import { Context } from "hono";
import { deletePermissionSchema } from "../schemas/deletePermissionSchema";
import { deletePermission } from "../services/deletePermission";
import { validateData } from "@/lib/validateData";

export const deletePermissionController = async (c: Context) => {
  const id = c.req.param("id");
  const validated = validateData({ id }, deletePermissionSchema);
  await deletePermission(validated);
  return c.json({ data: null });
};
