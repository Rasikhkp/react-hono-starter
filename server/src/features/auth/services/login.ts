import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { verifyPassword } from "@/lib/password";
import { createAuthSession } from "./createAuthSession";

export const login = async (input: {
  email: string;
  password: string;
}) => {
  const user = await db
    .selectFrom("users")
    .select(["id", "password"])
    .where("email", "=", input.email)
    .executeTakeFirst();

  if (!user || user.password === null) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Email or password is wrong",
      401,
    );
  }

  const valid = await verifyPassword(user.password, input.password);

  if (!valid) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Email or password is wrong",
      401,
    );
  }

  return createAuthSession(user.id);
};
