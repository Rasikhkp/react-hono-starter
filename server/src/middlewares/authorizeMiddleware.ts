import type { Context, Next } from "hono";
import { AppError, ERROR_TYPES } from "../lib/error";

export const authorize = (...requiredPermissions: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user || !user.permissions) {
      throw new AppError(
        ERROR_TYPES.FORBIDDEN,
        "You do not have permission to access this resource",
        403,
      );
    }

    const userPermissionNames = new Set(user.permissions.map((p: { name: string }) => p.name));

    const hasAll = requiredPermissions.every((p) => userPermissionNames.has(p));

    if (!hasAll) {
      throw new AppError(
        ERROR_TYPES.FORBIDDEN,
        "You do not have permission to access this resource",
        403,
      );
    }

    await next();
  };
};
