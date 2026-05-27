import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";

type EditRole = {
  id: string;
  name: string;
  description: string | null;
  permissionIds?: string[];
};

export const editRole = async (input: EditRole) => {
  const role = await db
    .selectFrom("roles")
    .select("id")
    .where("id", "=", input.id)
    .executeTakeFirst();

  if (!role) {
    throw new AppError(ERROR_TYPES.NOT_FOUND, "Role not found", 404);
  }

  try {
    await db
      .updateTable("roles")
      .set({
        name: input.name,
        description: input.description,
      })
      .where("id", "=", input.id)
      .execute();

    await db
      .deleteFrom("role_permissions")
      .where("roleId", "=", input.id)
      .execute();

    if (input.permissionIds && input.permissionIds.length > 0) {
      await db
        .insertInto("role_permissions")
        .values(
          input.permissionIds.map((permissionId) => ({
            roleId: input.id,
            permissionId,
          })),
        )
        .execute();
    }
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new AppError(
        ERROR_TYPES.CONFLICT,
        "A role with this name already exists",
        409,
      );
    }
    throw err;
  }
};
