import { Context } from "hono";
import { createPermission } from "../services/createPermission";
import { createPermissionSchema } from "../schemas/createPermissionSchema";
import { validateData } from "@/lib/validateData";

export const createPermissionController = async (c: Context) => {
  const body = await c.req.json();
  const validated = validateData(body, createPermissionSchema);
  await createPermission(validated);
  return c.json({ data: null });
};
