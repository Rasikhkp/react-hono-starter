import { Hono } from "hono";
import type { AuthUser } from "./lib/authUser";
import { authMiddleware } from "./middlewares/authMiddleware";
import { authRoutes } from "./features/auth/routes";
import { authProtectedRoutes } from "./features/auth/protectedRoutes";
import { userRoutes } from "./features/user/routes";
import { roleRoutes } from "./features/role/routes";
import { permissionRoutes } from "./features/permission/routes";

type Variables = {
  user: AuthUser;
};

export function createPublicApi() {
  const publicApi = new Hono<{ Variables: Variables }>();

  publicApi.route("/auth", authRoutes);

  return publicApi;
}

export function createProtectedApi() {
  const protectedApi = new Hono<{ Variables: Variables }>();

  protectedApi.use("*", authMiddleware);

  protectedApi.route("/", authProtectedRoutes);
  protectedApi.route("/", userRoutes);
  protectedApi.route("/", roleRoutes);
  protectedApi.route("/", permissionRoutes);

  return protectedApi;
}
