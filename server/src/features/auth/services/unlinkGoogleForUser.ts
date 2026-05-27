import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { getAuthUser } from "./getAuthUser";

export const unlinkGoogleForUser = async (userId: string) => {
  const row = await db
    .selectFrom("users")
    .select(["password", "googleSub"])
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!row) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "User not found", 404);
  }

  if (!row.googleSub) {
    throw new AppError(
      ERROR_TYPES.VALIDATION_ERROR,
      "Google is not linked to this account",
      400,
    );
  }

  if (row.password === null) {
    throw new AppError(
      ERROR_TYPES.VALIDATION_ERROR,
      "Set a password before disconnecting Google",
      400,
    );
  }

  await db
    .updateTable("users")
    .set({ googleSub: null })
    .where("id", "=", userId)
    .execute();

  return await getAuthUser(userId)
};
