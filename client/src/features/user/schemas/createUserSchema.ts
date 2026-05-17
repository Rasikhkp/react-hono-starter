import { type } from "arktype";

export const createUserSchema = type({
  name: type("string >= 2").configure({
    message: "Name must be at least 2 characters",
  }),
  email: type("string.email").configure({
    message: "Email must be a valid email address",
  }),
  password: type("string >= 8").configure({
    message: "Password must be at least 8 characters",
  }),
  isActive: type("boolean"),
  isEmailVerified: type("boolean"),
});
