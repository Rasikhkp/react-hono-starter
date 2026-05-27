import { db } from "../database";
import { permissionSeeder } from "./permissionSeeder";
import { roleSeeder } from "./roleSeeder";
import { userSeeder } from "./userSeeder";

const runSeeder = async () => {
  try {
    const permissionIds = await permissionSeeder();
    const roleIds = await roleSeeder(permissionIds);
    await userSeeder(roleIds);
  } finally {
    await db.destroy();
    console.log("DB connection closed");
  }
};

runSeeder();
