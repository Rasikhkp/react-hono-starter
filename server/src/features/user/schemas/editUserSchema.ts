import { type } from "arktype";

export const editUserSchema = type({
  id: type("string.uuid.v7"),
  name: type("string >= 2").configure({
    message: "Name must be at least 2 characters",
  }),
  email: type("string.email").configure({
    message: "Email must be a valid email address",
  }),
  oldPassword: type("string >= 8").configure({
    message: "Password must be at least 8 characters",
  }),
  newPassword: type("string >= 8").configure({
    message: "Password must be at least 8 characters",
  }),
  isActive: type("boolean"),
  isEmailVerified: type("boolean")
});
