import { Router } from "express";
import {
    createTaskAttachment,
    getAttachmentsByTaskId,
    updateTaskAttachment,
    deleteTaskAttachment,
} from "../controllers/taskAttachmentController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createTaskAttachment);
router.get("/task/:taskId", getAttachmentsByTaskId);
router.put("/:id", updateTaskAttachment);
router.delete("/:id", deleteTaskAttachment);

export default router;
