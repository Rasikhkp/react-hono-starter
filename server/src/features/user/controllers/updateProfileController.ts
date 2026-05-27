import type { Context } from "hono";
import { validateData } from "@/lib/validateData";
import { updateProfileSchema } from "../schemas/updateProfileSchema";
import { updateOwnProfile } from "../services/updateOwnProfile";

export const updateProfileController = async (c: Context) => {
  const body = await c.req.json();
  const validated = validateData(body, updateProfileSchema);
  const userId = c.get("user").id;

  const updated = await updateOwnProfile(userId, {
    name: validated.name,
    email: validated.email,
    oldPassword: validated.oldPassword,
    newPassword: validated.newPassword,
    avatar: validated.avatar,
  });

  return c.json({ data: updated });
};
