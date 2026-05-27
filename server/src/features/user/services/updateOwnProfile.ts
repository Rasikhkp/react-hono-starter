import { db } from "@/db/database";
import { getAuthUser } from "@/features/auth/services/getAuthUser";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { hashPassword, verifyPassword } from "@/lib/password";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

type UpdateOwnProfileInput = {
  name: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  avatar?: string | null;
};

export const updateOwnProfile = async (
  userId: string,
  input: UpdateOwnProfileInput,
) => {
  const user = await db
    .selectFrom("users")
    .select(["id", "email", "password", "avatar"])
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!user) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "User not found", 404);
  }

  const trimmedNew =
    typeof input.newPassword === "string" ? input.newPassword.trim() : "";
  const wantsPasswordChange = trimmedNew.length > 0;

  let newHashedPassword: string | undefined;

  if (wantsPasswordChange) {
    if (trimmedNew.length < 8) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "New password must be at least 8 characters",
        400,
      );
    }

    if (user.password === null) {
      // First time setting password — no old password needed
      newHashedPassword = await hashPassword(trimmedNew);
    } else {
      // Changing existing password — old password required
      const trimmedOld =
        typeof input.oldPassword === "string" ? input.oldPassword.trim() : "";

      if (!trimmedOld) {
        throw new AppError(
          ERROR_TYPES.VALIDATION_ERROR,
          "Current password is required to change password",
          400,
        );
      }

      if (trimmedOld.length < 8) {
        throw new AppError(
          ERROR_TYPES.VALIDATION_ERROR,
          "Current password must be at least 8 characters",
          400,
        );
      }

      const valid = await verifyPassword(user.password, trimmedOld);

      if (!valid) {
        throw new AppError(
          ERROR_TYPES.UNAUTHORIZED,
          "Current password is wrong",
          401,
        );
      }

      newHashedPassword = await hashPassword(trimmedNew);
    }
  }

  const nextEmail = normalizeEmail(input.email);
  const emailChanged = normalizeEmail(user.email ?? "") !== nextEmail;

  if (emailChanged) {
    const taken = await db
      .selectFrom("users")
      .select("id")
      .where(({ eb }) =>
        eb(
          eb.fn<string>("lower", [eb.fn<string>("trim", [eb.ref("email")])]),
          "=",
          nextEmail,
        ),
      )
      .where("id", "!=", userId)
      .executeTakeFirst();

    if (taken) {
      throw new AppError(
        ERROR_TYPES.CONFLICT,
        "That email is already in use",
        409,
      );
    }
  }

  await db
    .updateTable("users")
    .set({
      name: input.name.trim(),
      email: nextEmail,
      ...(input.avatar !== undefined && { avatar: input.avatar }),
      ...(emailChanged && { isEmailVerified: 0 }),
      ...(newHashedPassword && { password: newHashedPassword }),
    })
    .where("id", "=", userId)
    .execute();

  return await getAuthUser(userId);
};
