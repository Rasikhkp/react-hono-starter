import { db } from "@/db/database";

export const getRoles = async () => {
  const roles = await db
    .selectFrom("roles")
    .selectAll()
    .orderBy("createdAt", "desc")
    .execute();

  const rolePermissions = await db
    .selectFrom("role_permissions")
    .innerJoin("permissions", "permissions.id", "role_permissions.permissionId")
    .select([
      "role_permissions.roleId",
      "permissions.id as permissionId",
      "permissions.name as permissionName",
      "permissions.resource as permissionResource",
      "permissions.description as permissionDescription",
    ])
    .execute();

  const permissionsByRoleId = new Map<string, typeof rolePermissions>();
  for (const rp of rolePermissions) {
    if (!permissionsByRoleId.has(rp.roleId)) {
      permissionsByRoleId.set(rp.roleId, []);
    }
    permissionsByRoleId.get(rp.roleId)!.push(rp);
  }

  return roles.map((role) => ({
    ...role,
    permissions:
      permissionsByRoleId.get(role.id)?.map((p) => ({
        id: p.permissionId,
        name: p.permissionName,
        resource: p.permissionResource,
        description: p.permissionDescription,
      })) ?? [],
  }));
};
