import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { sql } from "kysely";

const getUserRoles = async (userId: string) => {
  return db
    .selectFrom("user_roles")
    .innerJoin("roles", "roles.id", "user_roles.roleId")
    .select(["roles.id", "roles.name"])
    .where("user_roles.userId", "=", userId)
    .execute();
}

const getUserPermissions = async (userId: string) => {
  return db
    .selectFrom("user_roles")
    .innerJoin(
      "role_permissions",
      "role_permissions.roleId",
      "user_roles.roleId"
    )
    .innerJoin(
      "permissions",
      "permissions.id",
      "role_permissions.permissionId"
    )
    .select([
      "permissions.id",
      "permissions.name",
      "permissions.resource",
    ])
    .where("user_roles.userId", "=", userId)
    .groupBy([
      "permissions.id",
      "permissions.name",
      "permissions.resource",
    ])
    .execute();
}

export const getAuthUser = async (userId: string) => {
  const user = await db
    .selectFrom("users")
    .select([
      "id",
      "name",
      "email",
      "isActive",
      "isEmailVerified",
      "googleSub",
      "avatar",
      sql<number>`IF(password IS NULL, 0, 1)`.as("hasPassword"),
    ])
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!user) {
    throw new AppError(ERROR_TYPES.UNAUTHORIZED, "User not found", 401);
  }

  const [roles, permissions] = await Promise.all([
    getUserRoles(user.id),
    getUserPermissions(user.id),
  ]);

  return {
    ...user,
    roles,
    permissions,
  };
}
