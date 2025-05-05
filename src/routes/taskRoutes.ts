import express from "express";
import * as taskController from "../controllers/taskController";

const router = express.Router();

router.post("/", taskController.createTask);
router.get('/visible/:id', taskController.getVisibleTasksForUser);
router.put("/:id", taskController.updateTask);
router.get("/:id", taskController.getTaskById);
router.get("/", taskController.getAllTasks);
router.get("/user/:userId", taskController.getTasksByUserId);

export default router;
