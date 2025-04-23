import express from "express";
import * as taskController from "../controllers/taskController";

const router = express.Router();

router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.get("/:id", taskController.getTaskById);
router.get("/", taskController.getAllTasks);

export default router;
