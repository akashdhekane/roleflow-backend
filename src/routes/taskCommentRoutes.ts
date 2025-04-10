import { Router } from "express";
import {
    createTaskComment,
    getCommentsByTaskId,
    updateTaskComment,
    deleteTaskComment,
} from "../controllers/taskCommentController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createTaskComment);
router.get("/task/:taskId", getCommentsByTaskId);
router.put("/:id", updateTaskComment);
router.delete("/:id", deleteTaskComment);

export default router;
