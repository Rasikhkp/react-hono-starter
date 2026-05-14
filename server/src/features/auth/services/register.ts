import { v7 } from "uuid";
import { db } from "@/db/database";
import { hashPassword } from "@/lib/password";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { signAccessToken } from "@/lib/jwt";
import { hashToken } from "@/lib/hash";
import { add } from "date-fns";

export const register = async (input: {
  email: string;
  password: string;
  name: string;
}) => {
  const existing = await db
    .selectFrom("users")
    .select(['id', 'name', 'password', 'email', 'isEmailVerified', 'isActive'])
    .where("email", "=", input.email)
    .executeTakeFirst();

  if (existing) {
    throw new AppError(
      ERROR_TYPES.VALIDATION_ERROR,
      "Email already registered",
      400
    );
  }

  const hashedPassword = await hashPassword(input.password);

  const newUserId = v7()

  await db
    .insertInto("users")
    .values({
      id: newUserId,
      email: input.email,
      name: input.name,
      password: hashedPassword,
    })
    .execute();

  const insertedUser = await db
    .selectFrom('users')
    .select(['id', 'name', 'email', 'isActive', 'isEmailVerified'])
    .where('id', '=', newUserId)
    .executeTakeFirst()

  if (!insertedUser) {
    throw new AppError(
      ERROR_TYPES.NOT_FOUND,
      "User not found",
      404
    );
  }

  const accessToken = await signAccessToken({
    sub: insertedUser.id,
  });

  const refreshToken = v7();
  const tokenHash = await hashToken(refreshToken);

  await db
    .insertInto("refresh_tokens")
    .values({
      id: v7(),
      userId: insertedUser.id,
      tokenHash: tokenHash,
      expiresAt: add(new Date(), { days: 7 }),
    })
    .execute();

  return {
    accessToken,
    refreshToken,
    user: insertedUser
  }
};


