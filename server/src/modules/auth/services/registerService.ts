import { v7 } from "uuid";
import { db } from "@/db/database";
import { hashPassword } from "@/utils/password";
import { AppError, ERROR_CODES } from "@/utils/error";

export const registerService = async (input: {
  email: string;
  password: string;
  name: string;
}) => {
  const existing = await db
    .selectFrom("users")
    .select(["id"])
    .where("email", "=", input.email)
    .executeTakeFirst();

  if (existing) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      "Invalid credentials",
      400
    );
  }

  const hashedPassword = await hashPassword(input.password);

  await db
    .insertInto("users")
    .values({
      id: v7(),
      email: input.email,
      name: input.name,
      password: hashedPassword,
    })
    .execute();
};


