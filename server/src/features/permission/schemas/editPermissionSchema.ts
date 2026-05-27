import { type } from "arktype";

export const editPermissionSchema = type({
  id: type("string.uuid.v7"),
  name: type("string >= 2").configure({
    message: "Name must be at least 2 characters",
  }),
  description: type("string | null"),
  resource: type("string >= 1").configure({
    message: "Resource is required",
  }),
});
