import { db } from "../database";
import { v7 } from "uuid";

const rolesData = [
  { name: "Super Admin", description: "Full system access" },
  { name: "Admin", description: "Administrative access without system settings" },
  { name: "Editor", description: "Can manage content" },
  { name: "Moderator", description: "Can moderate comments and posts" },
  { name: "Viewer", description: "Read-only access" },
];

export const roleSeeder = async (permissionIds: string[]) => {
  console.log("Seeding roles...");

  const existing = await db.selectFrom("roles").select("id").execute();

  if (existing.length > 0) {
    console.log("Roles already exist, skipping...");
    return [];
  }

  const roleIds = rolesData.map(() => v7());

  await db
    .insertInto("roles")
    .values(
      rolesData.map((r, i) => ({
        id: roleIds[i],
        name: r.name,
        description: r.description,
      })),
    )
    .execute();

  // Assign permissions to roles
  const rolePermissions: { roleId: string; permissionId: string }[] = [];

  // Super Admin gets all permissions
  for (const permId of permissionIds) {
    rolePermissions.push({ roleId: roleIds[0], permissionId: permId });
  }

  // Admin gets everything except roles/permissions management
  for (const permId of permissionIds) {
    const perm = permissionIds.indexOf(permId);
    const permName = [
      "users:read", "users:create", "users:update", "users:delete",
      "posts:read", "posts:create", "posts:update", "posts:delete",
      "comments:read", "comments:create", "comments:update", "comments:delete",
      "settings:read", "settings:update",
    ];
    // We'll just assign first 14 permissions (users, posts, comments, settings)
    if (perm < 14) {
      rolePermissions.push({ roleId: roleIds[1], permissionId: permId });
    }
  }

  // Editor gets posts and comments CRUD
  for (let i = 4; i < 12; i++) {
    rolePermissions.push({ roleId: roleIds[2], permissionId: permissionIds[i] });
  }

  // Moderator gets comments CRUD + posts read
  rolePermissions.push({ roleId: roleIds[3], permissionId: permissionIds[4] });
  for (let i = 8; i < 12; i++) {
    rolePermissions.push({ roleId: roleIds[3], permissionId: permissionIds[i] });
  }

  // Viewer gets read-only across users, posts, comments, settings
  rolePermissions.push({ roleId: roleIds[4], permissionId: permissionIds[0] });
  rolePermissions.push({ roleId: roleIds[4], permissionId: permissionIds[4] });
  rolePermissions.push({ roleId: roleIds[4], permissionId: permissionIds[8] });
  rolePermissions.push({ roleId: roleIds[4], permissionId: permissionIds[12] });

  if (rolePermissions.length > 0) {
    await db.insertInto("role_permissions").values(rolePermissions).execute();
  }

  console.log(`Successfully seeded ${rolesData.length} roles`);

  return roleIds;
};
