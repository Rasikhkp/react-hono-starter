import { type } from "arktype";

export const deleteUsersSchema = type({
  ids: "string.uuid.v7[]"
});
