import { Hono } from "hono";
import { authorize } from "../../middlewares/authorizeMiddleware";
import { getPermissionsController } from "./controllers/getPermissionsController";
import { createPermissionController } from "./controllers/createPermissionController";
import { editPermissionController } from "./controllers/editPermissionController";
import { deletePermissionController } from "./controllers/deletePermissionController";

const permissionRoutes = new Hono();

permissionRoutes.get("/permissions", authorize("permissions:read"), getPermissionsController);
permissionRoutes.post("/permissions", authorize("permissions:create"), createPermissionController);
permissionRoutes.put("/permissions/:id", authorize("permissions:update"), editPermissionController);
permissionRoutes.delete("/permissions/:id", authorize("permissions:delete"), deletePermissionController);

export { permissionRoutes };
