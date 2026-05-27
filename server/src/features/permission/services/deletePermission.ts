import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";

export const deletePermission = async ({ id }: { id: string }) => {
  const permission = await db
    .selectFrom("permissions")
    .select("id")
    .where("id", "=", id)
    .executeTakeFirst();

  if (!permission) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "Permission not found", 404);
  }

  await db.deleteFrom("permissions").where("id", "=", id).execute();
};
