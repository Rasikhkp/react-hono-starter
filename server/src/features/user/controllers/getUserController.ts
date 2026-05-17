import { Context } from "hono";
import { getUser } from "../services/getUser";
import { getUserSchema } from "../schemas/getUserSchema";
import { validateData } from "@/lib/validateData";

export const getUsersController = async (c: Context) => {
  const id = c.req.param('id')
  const validated = validateData({ id }, getUserSchema)
  const user = await getUser(validated);

  return c.json({ data: user })
}

