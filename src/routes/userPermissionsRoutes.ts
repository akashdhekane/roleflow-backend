import { Router } from "express";
import * as userPermissionsController from "../controllers/userPermissionsController";

const router = Router();

router.get("/permissions/definitions", userPermissionsController.getPermissionDefinitions);
router.get("/permissions", userPermissionsController.getAllRolePermissions);
router.get("/users/:userId/permissions/:permissionId", userPermissionsController.checkUserPermission);
router.get("/users/:userId/permissions", userPermissionsController.getUserPermissions);
router.post("/permissions", userPermissionsController.updateRolePermissions);

export default router;