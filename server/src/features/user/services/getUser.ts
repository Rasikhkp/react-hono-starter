import { db } from "@/db/database";

export const getUser = async ({ id }: { id: string }) => {
  return await db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst()
}
