import { Hono } from "hono";
import { getUsersController } from "./controllers/getUsersController";
import { createUserController } from "./controllers/createUserController";
import { editUserController } from "./controllers/editUserController";
import { deleteUserController } from "./controllers/deleteUserController";
import { deleteUsersController } from "./controllers/deleteUsersController";

const userRoutes = new Hono();

userRoutes.get("/users", getUsersController);
userRoutes.post("/users", createUserController);
userRoutes.put("/users/:id", editUserController);
userRoutes.delete("/users/:id", deleteUserController);
userRoutes.post("/users/bulk-delete", deleteUsersController);

export { userRoutes };
