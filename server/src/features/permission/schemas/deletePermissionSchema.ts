import { type } from "arktype";

export const deletePermissionSchema = type({
  id: type("string.uuid.v7"),
});
