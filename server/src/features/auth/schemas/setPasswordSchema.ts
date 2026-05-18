import { type } from "arktype";

export const setPasswordSchema = type({
  password: type("string >= 8").configure({
    message: "Password must be at least 8 characters",
  }),
});
