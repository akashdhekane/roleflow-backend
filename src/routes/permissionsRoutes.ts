import { Router } from "express";
import * as permissionsController from "../controllers/permissionsController";

const router = Router();

router.get("/permissions", permissionsController.getAllPermissions);
router.get("/roles", permissionsController.getAllRoles);
router.get("/roles/:roleId/permissions", permissionsController.getRolePermissions);

export default router;