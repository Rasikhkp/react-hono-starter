import { db } from "@/db/database";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { hashPassword } from "@/lib/password";
import { v7 } from "uuid";

type CreateUser = {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  isEmailVerified?: boolean
}

export const createUser = async (input: CreateUser) => {
  const newUserId = v7()

  const hashedPassword = await hashPassword(input.password);

  try {
    await db
      .insertInto('users')
      .values({
        id: newUserId,
        name: input.name,
        email: input.email,
        isEmailVerified: input.isEmailVerified ? 1 : 0,
        isActive: input.isActive ? 1 : 0,
        password: hashedPassword
      })
      .execute()
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new AppError(
        ERROR_TYPES.CONFLICT,
        "A user with this email already exists",
        409
      )
    }
    throw err
  }
}
