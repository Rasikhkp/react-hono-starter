import { db } from "@/db/database";

export const getPermissions = async () => {
  return await db
    .selectFrom("permissions")
    .selectAll()
    .orderBy("resource", "asc")
    .orderBy("name", "asc")
    .execute();
};
