import { db } from "../database";
import { v7 } from "uuid";
import { hashPassword } from "../../lib/password";

const usersData = [
  { name: "Alice Johnson", email: "alice@example.com", isActive: true, isEmailVerified: true },
  { name: "Bob Smith", email: "bob@example.com", isActive: true, isEmailVerified: true },
  { name: "Charlie Brown", email: "charlie@example.com", isActive: true, isEmailVerified: false },
  { name: "Diana Prince", email: "diana@example.com", isActive: true, isEmailVerified: true },
  { name: "Eve Davis", email: "eve@example.com", isActive: false, isEmailVerified: true },
  { name: "Frank Miller", email: "frank@example.com", isActive: true, isEmailVerified: true },
  { name: "Grace Hopper", email: "grace@example.com", isActive: true, isEmailVerified: true },
  { name: "Hank Pym", email: "hank@example.com", isActive: true, isEmailVerified: false },
  { name: "Ivy Poison", email: "ivy@example.com", isActive: true, isEmailVerified: true },
  { name: "Jack Ryan", email: "jack@example.com", isActive: false, isEmailVerified: false },
  { name: "Karen Page", email: "karen@example.com", isActive: true, isEmailVerified: true },
  { name: "Liam Neeson", email: "liam@example.com", isActive: true, isEmailVerified: true },
  { name: "Administrator", email: "admin@example.com", isActive: true, isEmailVerified: true },
];

export const userSeeder = async (roleIds: string[]) => {
  console.log("Seeding users...");

  const superAdminRoleId = roleIds[0];
  const password = await hashPassword("password123");
  let createdCount = 0;

  for (const userData of usersData) {
    const existing = await db
      .selectFrom("users")
      .select("id")
      .where("email", "=", userData.email)
      .executeTakeFirst();

    if (existing) {
      console.log(`User ${userData.email} already exists, skipping...`);
      continue;
    }

    const userId = v7();
    await db
      .insertInto("users")
      .values({
        id: userId,
        name: userData.name,
        email: userData.email,
        password,
        isActive: userData.isActive ? 1 : 0,
        isEmailVerified: userData.isEmailVerified ? 1 : 0,
      })
      .execute();

    await db.insertInto("user_roles").values({ userId, roleId: superAdminRoleId }).execute();

    createdCount++;
  }

  console.log(`Successfully seeded ${createdCount} new users`);
};
