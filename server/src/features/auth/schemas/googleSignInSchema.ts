import { type } from "arktype";

export const googleSignInSchema = type({
  code: type("string > 0").configure({
    message: "Missing Google authorization code",
  }),
});
