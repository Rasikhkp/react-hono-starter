import { db } from "../database";
import { v7 } from "uuid";

const permissionsData = [
  { name: "users:read", resource: "users", description: "View a paginated list of all users, including their profile details, assigned roles, account status, and activity state" },
  { name: "users:create", resource: "users", description: "Create new user accounts with name, email, password, and assign an initial role" },
  { name: "users:update", resource: "users", description: "Edit existing user profiles including name, email, account status, role assignment, and avatar" },
  { name: "users:delete", resource: "users", description: "Permanently delete user accounts and their associated records from the system" },
  { name: "roles:read", resource: "roles", description: "View the complete list of roles along with their descriptions and associated permissions" },
  { name: "roles:create", resource: "roles", description: "Create new roles with a custom name, description, and a chosen set of permissions" },
  { name: "roles:update", resource: "roles", description: "Modify existing role details including name, description, and permission assignments" },
  { name: "roles:delete", resource: "roles", description: "Remove roles from the system, which will affect all users currently assigned to them" },
  { name: "permissions:read", resource: "permissions", description: "View the complete list of all permissions available in the system, grouped by resource" },
  { name: "permissions:create", resource: "permissions", description: "Create new permissions to define additional access control rules for any resource" },
  { name: "permissions:update", resource: "permissions", description: "Edit existing permission names, descriptions, or the resource they apply to" },
  { name: "permissions:delete", resource: "permissions", description: "Permanently remove permissions from the system, revoking that access from all roles that include it" },
];

export const permissionSeeder = async () => {
  console.log("Seeding permissions...");

  const existing = await db
    .selectFrom("permissions")
    .select("id")
    .execute();

  if (existing.length > 0) {
    console.log("Permissions already exist, skipping...");
    return [];
  }

  const permissionIds = permissionsData.map(() => v7());

  await db
    .insertInto("permissions")
    .values(
      permissionsData.map((p, i) => ({
        id: permissionIds[i],
        name: p.name,
        resource: p.resource,
        description: p.description,
      })),
    )
    .execute();

  console.log(`Successfully seeded ${permissionsData.length} permissions`);

  return permissionIds;
};
