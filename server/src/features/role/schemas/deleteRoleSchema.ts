import { type } from "arktype";

export const deleteRoleSchema = type({
  id: type("string.uuid.v7"),
});
