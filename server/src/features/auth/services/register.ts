import { v7 } from "uuid";
import { db } from "@/db/database";
import { hashPassword } from "@/lib/password";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { createAuthSession } from "./createAuthSession";

export const register = async (input: {
  email: string;
  password: string;
  name: string;
}) => {
  const hashedPassword = await hashPassword(input.password);
  const newUserId = v7()

  try {
    await db
      .insertInto("users")
      .values({
        id: newUserId,
        email: input.email,
        name: input.name,
        password: hashedPassword,
      })
      .execute();
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new AppError(
        ERROR_TYPES.CONFLICT,
        "Email already registered",
        409
      );
    }
    throw err;
  }

  return createAuthSession(newUserId);
};
