import { v7 } from "uuid";
import { db } from "../../db/database";
import { hashToken } from "../../utils/hash";
import { signAccessToken } from "../../utils/jwt";
import { hashPassword, verifyPassword } from "../../utils/password";
import { add } from "date-fns";
import { AppError, ERROR_CODES } from "../../utils/error";

const register = async (input: {
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

const login = async (input: {
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

const refresh = async (refreshToken: string) => {
  const tokenHash = await hashToken(refreshToken);

  const token = await db
    .selectFrom("refresh_tokens")
    .selectAll()
    .where("token_hash", "=", tokenHash)
    .executeTakeFirst();

  if (!token || token.is_revoked) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      "Invalid refresh token",
      401
    );
  }

  if (new Date(token.expires_at) < new Date()) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
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

const logout = async (refreshToken: string) => {
  const tokenHash = await hashToken(refreshToken);

  await db
    .updateTable("refresh_tokens")
    .set({ is_revoked: 1 })
    .where("token_hash", "=", tokenHash)
    .execute();
};

export { register, login, refresh, logout };
