import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { v7 } from "uuid";

type CreatePermission = {
  name: string;
  description: string | null;
  resource: string;
};

export const createPermission = async (input: CreatePermission) => {
  const newPermissionId = v7();

  try {
    await db
      .insertInto("permissions")
      .values({
        id: newPermissionId,
        name: input.name,
        description: input.description,
        resource: input.resource,
      })
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
