import { Router } from "express";
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from "../controllers/taskController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
// router.post("/", authorizeRoles("Admin", "Manager", "TeamLead"), createTask);
router.post("/", createTask);
router.put("/:id", authorizeRoles("Admin", "Manager", "TeamLead", "SuperAdmin"), updateTask);
router.delete("/:id", authorizeRoles("Admin", "Manager", "TeamLead", "SuperAdmin"), deleteTask);

export default router;
