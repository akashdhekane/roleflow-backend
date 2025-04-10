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
router.post("/", authorizeRoles("Admin", "Manager", "TeamLead"), createTask);
router.put("/:id", authorizeRoles("Admin", "Manager", "TeamLead"), updateTask);
router.delete("/:id", authorizeRoles("Admin", "Manager"), deleteTask);

export default router;
