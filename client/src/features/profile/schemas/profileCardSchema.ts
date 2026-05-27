import { type } from "arktype";

export const profileCardSchema = type({
  name: type("string >= 2").configure({
    message: "Name must be at least 2 characters",
  }),
  email: type("string.email").configure({
    message: "Email must be a valid email address",
  }),
  avatar: type("string | null"),
  oldPassword: type("string >= 8 | ''"),
  newPassword: type("string >= 8 | ''"),
});
