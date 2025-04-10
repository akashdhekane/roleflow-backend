import { Router } from "express";
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} from "../controllers/departmentController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/", authorizeRoles("Admin", "SuperAdmin"), createDepartment);
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.put("/:id", authorizeRoles("Admin", "SuperAdmin"), updateDepartment);
router.delete("/:id", authorizeRoles("Admin", "SuperAdmin"), deleteDepartment);

export default router;
