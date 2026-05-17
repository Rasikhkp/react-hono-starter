import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";

export const deleteUser = async ({ id }: { id: string }) => {
  const user = await db.selectFrom('users').select('id').where('id', '=', id).executeTakeFirst()

  if (!user) {
    throw new AppError(
      ERROR_TYPES.NOT_FOUND,
      "User not found",
      404
    );
  }

  await db.deleteFrom('users').where('id', '=', id).execute()
}
