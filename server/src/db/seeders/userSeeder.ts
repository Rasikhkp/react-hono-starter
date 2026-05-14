import { v7 } from "uuid";
import { db } from "../database";
import { hashPassword } from "../../lib/password";

export const userSeeder = async () => {
  console.log("Seeding users");

  try {
    const existing = await db
      .selectFrom("users")
      .select("id")
      .where("email", "=", "admin@example.com")
      .executeTakeFirst();

    if (existing) {
      console.log("Admin user already exists, skipping...");
      return;
    }

    const password = await hashPassword("password123");

    await db
      .insertInto("users")
      .values([
        {
          id: v7(),
          email: "admin@example.com",
          name: "Admin",
          password,
          isActive: 1,
          isEmailVerified: 1,
        },
      ])
      .execute();

    console.log("Successfully seeded users");
  } catch (err) {
    console.error("Failed to seed users:", err);

    throw err;
  } finally {
    await db.destroy();
    console.log("DB connection closed");
  }
};
