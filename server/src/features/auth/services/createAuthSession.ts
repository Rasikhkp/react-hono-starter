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

  // Fetch roles and permissions for the session user
  const userRoles = await db
    .selectFrom("user_roles")
    .innerJoin("roles", "roles.id", "user_roles.roleId")
    .select(["roles.id", "roles.name"])
    .where("user_roles.userId", "=", row.id)
    .execute();

  const roleIds = userRoles.map((r) => r.id);
  let userPermissions: { id: string; name: string; resource: string }[] = [];

  if (roleIds.length > 0) {
    userPermissions = await db
      .selectFrom("role_permissions")
      .innerJoin("permissions", "permissions.id", "role_permissions.permissionId")
      .select(["permissions.id", "permissions.name", "permissions.resource"])
      .where("role_permissions.roleId", "in", roleIds)
      .groupBy(["permissions.id", "permissions.name", "permissions.resource"])
      .execute();
  }

  return {
    accessToken,
    refreshToken,
    user: toAuthUser(
      row,
      userRoles.map((r) => ({ id: r.id, name: r.name })),
      userPermissions.map((p) => ({ id: p.id, name: p.name, resource: p.resource })),
    ),
  };
}
