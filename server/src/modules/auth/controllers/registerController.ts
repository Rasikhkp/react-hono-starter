import { Context } from "hono";
import { type } from "arktype";
import { AppError, ERROR_CODES } from "@/utils/error";
import { registerService } from "../services/registerService";
import { signUpSchema } from "../schemas/signUpSchema";

export const registerController = async (c: Context) => {
  const body = await c.req.json();
  const out = signUpSchema(body);

  if (out instanceof type.errors) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, out.summary, 400)
  }

  await registerService(out);

  return c.json({ data: null });
}
