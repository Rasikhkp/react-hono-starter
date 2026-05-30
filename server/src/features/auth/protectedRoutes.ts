import { Hono } from "hono";
import { logoutController } from "./controllers/logoutController";
import { unlinkGoogleController } from "./controllers/unlinkGoogleController";

const authProtectedRoutes = new Hono();

authProtectedRoutes.post("/auth/logout", logoutController);
authProtectedRoutes.post("/auth/unlink-google", unlinkGoogleController);

export { authProtectedRoutes };
