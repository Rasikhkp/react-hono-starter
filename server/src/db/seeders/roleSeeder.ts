import { db } from "../database";
import { v7 } from "uuid";

const rolesData = [
  { name: "Super Admin", description: "Full system access" },
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

  const rolePermissions = permissionIds.map((permId) => ({
    roleId: roleIds[0],
    permissionId: permId,
  }));

  await db.insertInto("role_permissions").values(rolePermissions).execute();

  console.log(`Successfully seeded ${rolesData.length} roles`);

  return roleIds;
};
