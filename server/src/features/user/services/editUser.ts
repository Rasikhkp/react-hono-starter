import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { hashPassword } from "@/lib/password";

type EditUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roleIds?: string[];
}

export const editUser = async (input: EditUser) => {
  const user = await db.selectFrom('users').select(['id']).where('id', '=', input.id).executeTakeFirst()

  if (!user) {
    throw new AppError(
      ERROR_TYPES.NOT_FOUND,
      "User not found",
      404
    );
  }

  let newHashedPassword;

  if (input.password) {
    newHashedPassword = await hashPassword(input.password);
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

  if (input.roleIds !== undefined) {
    await db
      .deleteFrom('user_roles')
      .where('userId', '=', user.id)
      .execute()

    if (input.roleIds.length > 0) {
      await db
        .insertInto('user_roles')
        .values(input.roleIds.map(roleId => ({
          userId: user.id,
          roleId,
        })))
        .execute()
    }
  }
}
