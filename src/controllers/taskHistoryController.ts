import { Request, Response } from "express";
import * as taskHistoryService from "../services/taskHistoryService";

export const getTaskHistoryByTaskId = async (req: Request, res: Response) => {
    const taskId = req.params.taskId;
    const history = await taskHistoryService.getTaskHistoryByTaskId(taskId);
    res.json(history);
};
