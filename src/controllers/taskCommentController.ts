import { Request, Response } from "express";
import * as taskCommentService from "../services/taskCommentService";

// Define a local custom Request type with optional user
interface CustomRequest extends Request {
    user?: { id: string; role?: string };
}

export const createTaskComment = async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    try {
        const comment = await taskCommentService.createTaskComment({
            ...req.body,
            createdBy: customReq.user!.id,
        });
        res.status(201).json(comment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCommentsByTaskId = async (req: Request, res: Response) => {
    try {
        const comments = await taskCommentService.getCommentsByTaskId(req.params.taskId);
        res.json(comments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTaskComment = async (req: Request, res: Response) => {
    try {
        const comment = await taskCommentService.updateTaskComment(req.params.id, req.body.text);
        res.json(comment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTaskComment = async (req: Request, res: Response) => {
    try {
        await taskCommentService.deleteTaskComment(req.params.id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
