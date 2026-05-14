import { v7 } from "uuid";
import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { verifyPassword } from "@/lib/password";
import { signAccessToken } from "@/lib/jwt";
import { hashToken } from "@/lib/hash";
import { add } from "date-fns";

export const login = async (input: {
  email: string;
  password: string;
}) => {
  const user = await db
    .selectFrom("users")
    .select(['id', 'name', 'password', 'email', 'isEmailVerified', 'isActive'])
    .where("email", "=", input.email)
    .executeTakeFirst();

  if (!user) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Email or password is wrong",
      401
    );
  }

  const valid = await verifyPassword(user.password, input.password);

  if (!valid) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Email or password is wrong",
      401
    );
  }

  const accessToken = await signAccessToken({
    sub: user.id,
  });

  const refreshToken = v7();
  const tokenHash = await hashToken(refreshToken);

  await db
    .insertInto("refresh_tokens")
    .values({
      id: v7(),
      userId: user.id,
      tokenHash: tokenHash,
      expiresAt: add(new Date(), { days: 7 }),
    })
    .execute();

  return {
    accessToken,
    refreshToken,
    user
  };
};
