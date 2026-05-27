import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";

export const deleteRole = async ({ id }: { id: string }) => {
  const role = await db
    .selectFrom("roles")
    .select("id")
    .where("id", "=", id)
    .executeTakeFirst();

  if (!role) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "Role not found", 404);
  }

  await db.deleteFrom("roles").where("id", "=", id).execute();
};
