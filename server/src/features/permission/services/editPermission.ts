import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";

type EditPermission = {
  id: string;
  name: string;
  description: string | null;
  resource: string;
};

export const editPermission = async (input: EditPermission) => {
  const permission = await db
    .selectFrom("permissions")
    .select("id")
    .where("id", "=", input.id)
    .executeTakeFirst();

  if (!permission) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "Permission not found", 404);
  }

  try {
    await db
      .updateTable("permissions")
      .set({
        name: input.name,
        description: input.description,
        resource: input.resource,
      })
      .where("id", "=", input.id)
      .execute();
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new AppError(
        ERROR_TYPES.CONFLICT,
        "A permission with this name already exists",
        409,
      );
    }
    throw err;
  }
};
