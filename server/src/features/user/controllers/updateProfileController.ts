import type { Context } from "hono";
import { db } from "@/db/database";
import { saveFile, deleteFile } from "@/lib/file";
import { validateData } from "@/lib/validateData";
import { updateProfileSchema } from "../schemas/updateProfileSchema";
import { updateOwnProfile } from "../services/updateOwnProfile";

export const updateProfileController = async (c: Context) => {
  const userId = c.get("user").id;

  const currentUser = await db
    .selectFrom("users")
    .select("avatar")
    .where("id", "=", userId)
    .executeTakeFirst();

  const oldAvatar = currentUser?.avatar;

  const formData = await c.req.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const oldPassword = formData.get("oldPassword") as string | null;
  const newPassword = formData.get("newPassword") as string | null;

  const avatarFile = formData.get("avatar");

  let avatar: string | null | undefined = undefined;

  if (avatarFile instanceof File) {
    const relativePath = await saveFile(avatarFile, "avatars");
    avatar = `/uploads/${relativePath}`;
  } else if (avatarFile === "") {
    avatar = null;
  }

  const payload: Record<string, unknown> = { name, email };
  if (oldPassword !== null) payload.oldPassword = oldPassword;
  if (newPassword !== null) payload.newPassword = newPassword;

  const validated = validateData(payload, updateProfileSchema);

  const updated = await updateOwnProfile(userId, {
    name: validated.name,
    email: validated.email,
    oldPassword: validated.oldPassword,
    newPassword: validated.newPassword,
    avatar,
  });

  if (oldAvatar && oldAvatar.startsWith("/uploads/") && oldAvatar !== avatar) {
    const relativePath = oldAvatar.replace("/uploads/", "");
    await deleteFile(relativePath);
  }

  return c.json({ data: updated });
};
