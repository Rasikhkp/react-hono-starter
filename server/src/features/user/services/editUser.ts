import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { hashPassword, verifyPassword } from "@/lib/password";

type EditUser = {
  id: string;
  name: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  isActive: boolean;
  isEmailVerified: boolean
}

export const editUser = async (input: EditUser) => {
  const user = await db.selectFrom('users').select(['id', 'password']).where('id', '=', input.id).executeTakeFirst()

  if (!user) {
    throw new AppError(
      ERROR_TYPES.NOT_FOUND,
      "User not found",
      404
    );
  }

  let newHashedPassword;

  if (input.oldPassword && input.newPassword) {
    const valid = await verifyPassword(user.password, input.oldPassword);

    if (!valid) {
      throw new AppError(
        ERROR_TYPES.UNAUTHORIZED,
        "Old password is wrong",
        401
      );
    }

    newHashedPassword = await hashPassword(input.newPassword);
  }

  const updatedUserData = {
    name: input.name,
    email: input.email,
    isActive: input.isActive ? 1 : 0,
    isEmailVerified: input.isEmailVerified ? 1 : 0,
    ...(newHashedPassword && { password: newHashedPassword }),
  }

  await db
    .updateTable('users')
    .set(updatedUserData)
    .where('id', '=', user.id)
    .execute()
}
