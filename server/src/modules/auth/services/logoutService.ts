import { db } from "@/db/database";
import { hashToken } from "@/utils/hash";

export const logoutService = async (refreshToken: string) => {
  const tokenHash = await hashToken(refreshToken);

  await db
    .updateTable("refresh_tokens")
    .set({ is_revoked: 1 })
    .where("token_hash", "=", tokenHash)
    .execute();
};


