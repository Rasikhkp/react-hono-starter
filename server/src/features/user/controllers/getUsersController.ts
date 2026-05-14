import { Context } from "hono";
import { getUsers } from "../services/getUsers";

export const getUsersController = async (c: Context) => {
  const users = await getUsers();

  return c.json({ data: users })
}

