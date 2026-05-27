import { db } from "@/db/database";

export const getUsers = async () => {
  const users = await db
    .selectFrom("users")
    .selectAll()
    .orderBy("createdAt", "desc")
    .execute();

  const userIds = users.map((u) => u.id);

  const userRoles =
    userIds.length > 0
      ? await db
          .selectFrom("user_roles")
          .innerJoin("roles", "roles.id", "user_roles.roleId")
          .select(["user_roles.userId", "roles.id as roleId", "roles.name as roleName"])
          .where("user_roles.userId", "in", userIds)
          .execute()
      : [];

  const rolesByUserId = new Map<string, { id: string; name: string }[]>();
  for (const ur of userRoles) {
    if (!rolesByUserId.has(ur.userId)) {
      rolesByUserId.set(ur.userId, []);
    }
    rolesByUserId.get(ur.userId)!.push({ id: ur.roleId, name: ur.roleName });
  }

  return users.map((user) => ({
    ...user,
    roles: rolesByUserId.get(user.id) ?? [],
  }));
};
