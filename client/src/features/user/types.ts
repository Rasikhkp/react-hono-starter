import type { createUserSchema } from "./schemas/createUserSchema";
import type { editUserSchema } from "./schemas/editUserSchema";

export type User = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
};

export type CreateUser = typeof createUserSchema.infer;
export type EditUser = typeof editUserSchema.infer;
