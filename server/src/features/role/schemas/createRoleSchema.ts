import { type } from "arktype";

export const createRoleSchema = type({
  name: type("string >= 2").configure({
    message: "Name must be at least 2 characters",
  }),
  description: type("string | null"),
  "permissionIds?": type("string.uuid.v7[]"),
});
