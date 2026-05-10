import { type } from "arktype";

export const signInSchema = type({
  email: type("string.email").configure({
    message: "Email must be a valid email address",
  }),
  password: type("string >= 8").configure({
    message: "Password must be at least 8 characters",
  }),
});
