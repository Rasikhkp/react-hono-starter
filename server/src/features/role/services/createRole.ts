import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { v7 } from "uuid";

type CreateRole = {
  name: string;
  description: string | null;
  permissionIds?: string[];
};

export const createRole = async (input: CreateRole) => {
  const newRoleId = v7();

  try {
    await db
      .insertInto("roles")
      .values({
        id: newRoleId,
        name: input.name,
        description: input.description,
      })
      .execute();

    if (input.permissionIds && input.permissionIds.length > 0) {
      await db
        .insertInto("role_permissions")
        .values(
          input.permissionIds.map((permissionId) => ({
            roleId: newRoleId,
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
