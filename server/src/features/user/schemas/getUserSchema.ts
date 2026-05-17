import { type } from "arktype";

export const getUserSchema = type({
  id: type("string.uuid.v7")
});
