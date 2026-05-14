import { Context } from "hono";
import { type } from "arktype";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { editUserSchema } from "../schemas/editUserSchema";
import { editUser } from "../services/editUser";

export const editUserController = async (c: Context) => {
  const body = await c.req.json();
  const id = c.req.param('id')

  const out = editUserSchema({ id, ...body });

  if (out instanceof type.errors) {
    throw new AppError(ERROR_TYPES.VALIDATION_ERROR, out.summary, 422)
  }

  await editUser(out);

  return c.json({ data: null });
}
