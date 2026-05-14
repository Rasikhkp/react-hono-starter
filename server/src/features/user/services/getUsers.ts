import { db } from "@/db/database";

export const getUsers = async () => {
  return await db.selectFrom('users').selectAll().execute()
}
