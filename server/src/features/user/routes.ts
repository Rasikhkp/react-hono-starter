import { Hono } from "hono";
import { authorize } from "../../middlewares/authorizeMiddleware";
import { getUsersController } from "./controllers/getUsersController";
import { createUserController } from "./controllers/createUserController";
import { editUserController } from "./controllers/editUserController";
import { deleteUserController } from "./controllers/deleteUserController";
import { deleteUsersController } from "./controllers/deleteUsersController";

const userRoutes = new Hono();

userRoutes.get("/users", authorize("users:read"), getUsersController);
userRoutes.post("/users", authorize("users:create"), createUserController);
userRoutes.put("/users/:id", authorize("users:update"), editUserController);
userRoutes.delete("/users/:id", authorize("users:delete"), deleteUserController);
userRoutes.post("/users/bulk-delete", authorize("users:delete"), deleteUsersController);

export { userRoutes };
