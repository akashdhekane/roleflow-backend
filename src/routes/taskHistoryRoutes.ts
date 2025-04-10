import { Router } from "express";
import { getTaskHistoryByTaskId } from "../controllers/taskHistoryController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/task/:taskId", getTaskHistoryByTaskId);

export default router;
