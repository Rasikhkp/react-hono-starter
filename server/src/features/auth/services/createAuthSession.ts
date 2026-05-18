import { v7 } from "uuid";
import { add } from "date-fns";
import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { hashToken } from "@/lib/hash";
import { signAccessToken } from "@/lib/jwt";
import {
  authUserFields,
  toAuthUser,
} from "@/lib/authUser";

export async function createAuthSession(userId: string) {
  const row = await db
    .selectFrom("users")
    .select(authUserFields)
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!row) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "User not found", 404);
  }

  const accessToken = await signAccessToken({
    sub: row.id,
  });

  const refreshToken = v7();
  const tokenHash = await hashToken(refreshToken);

  await db
    .insertInto("refresh_tokens")
    .values({
      id: v7(),
      userId: row.id,
      tokenHash,
      expiresAt: add(new Date(), { days: 7 }),
    })
    .execute();

  return {
    accessToken,
    refreshToken,
    user: toAuthUser(row),
  };
}
