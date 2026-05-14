import { Context } from "hono";
import { type } from "arktype";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { createUser } from "../services/createUser";
import { createUserSchema } from "../schemas/createUserSchema";

export const createUserController = async (c: Context) => {
  const body = await c.req.json();
  const out = createUserSchema(body);

  if (out instanceof type.errors) {
    throw new AppError(ERROR_TYPES.VALIDATION_ERROR, out.summary, 422)
  }

  await createUser(out);

  return c.json({ data: null });
}
