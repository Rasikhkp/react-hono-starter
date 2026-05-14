import { v7 } from "uuid";
import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/utils/error";
import { hashToken } from "@/utils/hash";
import { signAccessToken } from "@/utils/jwt";
import { add } from "date-fns";

export const refreshService = async (refreshToken: string) => {
  const tokenHash = await hashToken(refreshToken);

  const token = await db
    .selectFrom("refresh_tokens")
    .selectAll()
    .where("token_hash", "=", tokenHash)
    .executeTakeFirst();

  if (!token || token.is_revoked) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Invalid refresh token",
      401
    );
  }

  if (new Date(token.expires_at) < new Date()) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Refresh token expired",
      401
    );
  }

  await db
    .updateTable("refresh_tokens")
    .set({ is_revoked: 1 })
    .where("id", "=", token.id)
    .execute();

  const newAccessToken = await signAccessToken({
    sub: token.user_id,
  });

  const newRefreshToken = v7();
  const refreshTokenHash = await hashToken(newRefreshToken);

  await db
    .insertInto("refresh_tokens")
    .values({
      id: v7(),
      user_id: token.user_id,
      token_hash: refreshTokenHash,
      expires_at: add(new Date(), { days: 7 }),
    })
    .execute();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

