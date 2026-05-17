import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";

export const deleteUsers = async ({ ids }: { ids: string[] }) => {
  if (!ids || ids.length === 0) {
    throw new AppError(
      ERROR_TYPES.VALIDATION_ERROR,
      "No user ids provided",
      400
    );
  }

  const existingUsers = await db
    .selectFrom("users")
    .select("id")
    .where("id", "in", ids)
    .execute();

  if (existingUsers.length === 0) {
    throw new AppError(
      ERROR_TYPES.NOT_FOUND,
      "No users found",
      404
    );
  }

  await db
    .deleteFrom("users")
    .where("id", "in", ids)
    .execute();
};
