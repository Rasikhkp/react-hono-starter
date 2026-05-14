import { Context } from "hono";
import { type } from "arktype";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { deleteUserSchema } from "../schemas/deleteUserSchema";
import { deleteUser } from "../services/deleteUser";

export const deleteUserController = async (c: Context) => {
  const id = c.req.param('id')
  const out = deleteUserSchema({ id });

  if (out instanceof type.errors) {
    throw new AppError(ERROR_TYPES.VALIDATION_ERROR, out.summary, 422)
  }

  await deleteUser(out);

  return c.json({ data: null });
}
