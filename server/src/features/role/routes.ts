import { Hono } from "hono";
import { authorize } from "../../middlewares/authorizeMiddleware";
import { getRolesController } from "./controllers/getRolesController";
import { createRoleController } from "./controllers/createRoleController";
import { editRoleController } from "./controllers/editRoleController";
import { deleteRoleController } from "./controllers/deleteRoleController";

const roleRoutes = new Hono();

roleRoutes.get("/roles", authorize("roles:read"), getRolesController);
roleRoutes.post("/roles", authorize("roles:create"), createRoleController);
roleRoutes.put("/roles/:id", authorize("roles:update"), editRoleController);
roleRoutes.delete("/roles/:id", authorize("roles:delete"), deleteRoleController);

export { roleRoutes };
