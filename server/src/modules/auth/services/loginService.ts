import { v7 } from "uuid";
import { db } from "@/db/database";
import { AppError, ERROR_CODES } from "@/utils/error";
import { verifyPassword } from "@/utils/password";
import { signAccessToken } from "@/utils/jwt";
import { hashToken } from "@/utils/hash";
import { add } from "date-fns";

export const loginService = async (input: {
  email: string;
  password: string;
}) => {
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", input.email)
    .executeTakeFirst();

  if (!user) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      "Invalid credentials",
      401
    );
  }

  const valid = await verifyPassword(user.password, input.password);

  if (!valid) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      "Invalid credentials",
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
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: add(new Date(), { days: 7 }),
    })
    .execute();

  return {
    accessToken,
    refreshToken,
  };
};
