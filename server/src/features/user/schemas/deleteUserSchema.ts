import { type } from "arktype";

export const deleteUserSchema = type({
  id: type("string.uuid.v7")
});
