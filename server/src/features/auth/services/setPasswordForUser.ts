import { db } from "@/db/database";
import { authUserFields, toAuthUser } from "@/lib/authUser";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { hashPassword } from "@/lib/password";

export const setPasswordForUser = async (userId: string, plainPassword: string) => {
  const row = await db
    .selectFrom("users")
    .select("password")
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!row) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "User not found", 404);
  }

  if (row.password !== null) {
    throw new AppError(
      ERROR_TYPES.CONFLICT,
      "Password already set",
      409,
    );
  }

  const hashed = await hashPassword(plainPassword);

  await db
    .updateTable("users")
    .set({ password: hashed })
    .where("id", "=", userId)
    .execute();

  const sessionRow = await db
    .selectFrom("users")
    .select(authUserFields)
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!sessionRow) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "User not found", 404);
  }

  return toAuthUser(sessionRow);
};
