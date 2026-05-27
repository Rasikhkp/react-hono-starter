import { db } from "../database";
import { v7 } from "uuid";

const permissionsData = [
  // Users resource
  { name: "users:read", resource: "users", description: "View users list and details" },
  { name: "users:create", resource: "users", description: "Create new users" },
  { name: "users:update", resource: "users", description: "Update existing users" },
  { name: "users:delete", resource: "users", description: "Delete users" },
  // Posts resource
  { name: "posts:read", resource: "posts", description: "View posts" },
  { name: "posts:create", resource: "posts", description: "Create posts" },
  { name: "posts:update", resource: "posts", description: "Update posts" },
  { name: "posts:delete", resource: "posts", description: "Delete posts" },
  // Comments resource
  { name: "comments:read", resource: "comments", description: "View comments" },
  { name: "comments:create", resource: "comments", description: "Create comments" },
  { name: "comments:update", resource: "comments", description: "Update comments" },
  { name: "comments:delete", resource: "comments", description: "Delete comments" },
  // Settings resource
  { name: "settings:read", resource: "settings", description: "View system settings" },
  { name: "settings:update", resource: "settings", description: "Update system settings" },
  // Roles resource
  { name: "roles:read", resource: "roles", description: "View roles" },
  { name: "roles:create", resource: "roles", description: "Create roles" },
  { name: "roles:update", resource: "roles", description: "Update roles" },
  { name: "roles:delete", resource: "roles", description: "Delete roles" },
  // Permissions resource
  { name: "permissions:read", resource: "permissions", description: "View permissions" },
  { name: "permissions:create", resource: "permissions", description: "Create permissions" },
  { name: "permissions:update", resource: "permissions", description: "Update permissions" },
  { name: "permissions:delete", resource: "permissions", description: "Delete permissions" },
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
