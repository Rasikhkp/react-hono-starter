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
];

export const userSeeder = async (roleIds: string[]) => {
  console.log("Seeding users...");

  const existingUsers = await db
    .selectFrom("users")
    .select(["id", "email", "avatar"])
    .execute();

  // Backfill avatars for existing users
  const usersWithoutAvatar = existingUsers.filter((u) => !u.avatar);
  if (usersWithoutAvatar.length > 0) {
    console.log(`Backfilling ${usersWithoutAvatar.length} avatars...`);
    for (const user of usersWithoutAvatar) {
      const seedUser = usersData.find((u) => u.email === user.email);
      const name = seedUser?.name ?? user.email.split("@")[0];
      await db
        .updateTable("users")
        .set({
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        })
        .where("id", "=", user.id)
        .execute();
    }
  }

  if (existingUsers.length >= 10) {
    console.log("Users already seeded, skipping inserts...");
    return;
  }

  const password = await hashPassword("password123");

  const userIds = usersData.map(() => v7());

  await db
    .insertInto("users")
    .values(
      usersData.map((u, i) => ({
        id: userIds[i],
        name: u.name,
        email: u.email,
        password,
        isActive: u.isActive ? 1 : 0,
        isEmailVerified: u.isEmailVerified ? 1 : 0,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`,
      })),
    )
    .execute();

  // Assign roles to users
  const userRoles: { userId: string; roleId: string }[] = [];

  // First user gets Super Admin
  userRoles.push({ userId: userIds[0], roleId: roleIds[0] });
  // Second user gets Admin
  userRoles.push({ userId: userIds[1], roleId: roleIds[1] });
  // Third user gets Editor
  userRoles.push({ userId: userIds[2], roleId: roleIds[2] });
  // Fourth user gets Moderator
  userRoles.push({ userId: userIds[3], roleId: roleIds[3] });
  // Rest get Viewer
  for (let i = 4; i < usersData.length; i++) {
    userRoles.push({ userId: userIds[i], roleId: roleIds[4] });
  }

  await db.insertInto("user_roles").values(userRoles).execute();

  console.log(`Successfully seeded ${usersData.length} users with roles`);
};
