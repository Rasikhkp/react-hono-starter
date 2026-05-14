import { db } from "@/db/database";
import { hashToken } from "@/lib/hash";

export const logout = async (refreshToken: string) => {
  const tokenHash = await hashToken(refreshToken);

  await db
    .updateTable("refresh_tokens")
    .set({ isRevoked: 1 })
    .where("tokenHash", "=", tokenHash)
    .execute();
};


