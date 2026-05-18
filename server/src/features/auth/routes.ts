import { Hono } from "hono";
import { registerController } from "./controllers/registerController";
import { loginController } from "./controllers/loginController";
import { refreshController } from "./controllers/refreshController";
import { googleSignInController } from "./controllers/googleSignInController";

const authRoutes = new Hono();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/refresh", refreshController);
authRoutes.post("/google", googleSignInController);

export { authRoutes };
