import { db } from "@/db/database";
import { authUserFields, type AuthUser, toAuthUser } from "@/lib/authUser";
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
};

export const updateOwnProfile = async (
  userId: string,
  input: UpdateOwnProfileInput,
): Promise<AuthUser> => {
  const user = await db
    .selectFrom("users")
    .select(["id", "email", "password"])
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!user) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "User not found", 404);
  }

  const trimmedOld =
    typeof input.oldPassword === "string" ? input.oldPassword.trim() : "";
  const trimmedNew =
    typeof input.newPassword === "string" ? input.newPassword.trim() : "";

  const wantsPasswordChange =
    trimmedOld.length > 0 || trimmedNew.length > 0;

  if (wantsPasswordChange && (!trimmedOld || !trimmedNew)) {
    throw new AppError(
      ERROR_TYPES.VALIDATION_ERROR,
      "Provide both current password and new password to change password",
      400,
    );
  }

  let newHashedPassword: string | undefined;

  if (trimmedOld && trimmedNew) {
    if (trimmedNew.length < 8) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "New password must be at least 8 characters",
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

    if (user.password === null) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "Use set-password to add your first password before changing it here",
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

  const nextEmail = normalizeEmail(input.email);
  const emailChanged =
    normalizeEmail(user.email ?? "") !== nextEmail;

  if (emailChanged) {
    const taken = await db
      .selectFrom("users")
      .select("id")
      .where(({ eb }) =>
        eb(eb.fn<string>("lower", [eb.fn<string>("trim", [eb.ref("email")])]), "=", nextEmail),
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
      ...(emailChanged && { isEmailVerified: 0 }),
      ...(newHashedPassword && { password: newHashedPassword }),
    })
    .where("id", "=", userId)
    .execute();

  const row = await db
    .selectFrom("users")
    .select(authUserFields)
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!row) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "User not found", 404);
  }

  return toAuthUser(row);
};
