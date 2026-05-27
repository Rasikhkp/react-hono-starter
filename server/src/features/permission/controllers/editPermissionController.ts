import { Context } from "hono";
import { editPermissionSchema } from "../schemas/editPermissionSchema";
import { editPermission } from "../services/editPermission";
import { validateData } from "@/lib/validateData";

export const editPermissionController = async (c: Context) => {
  const body = await c.req.json();
  const id = c.req.param("id");
  const validated = validateData({ id, ...body }, editPermissionSchema);
  await editPermission(validated);
  return c.json({ data: null });
};
