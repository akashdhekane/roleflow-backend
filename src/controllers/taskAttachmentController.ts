import { Request, Response } from "express";
import * as taskAttachmentService from "../services/taskAttachmentService";

// Extend the Request type locally to include `user`
interface CustomRequest extends Request {
    user?: { id: string; role?: string };
}

export const createTaskAttachment = async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    const attachment = await taskAttachmentService.createTaskAttachment({
        ...req.body,
        uploadedBy: customReq.user!.id,
    });
    res.status(201).json(attachment);
};

export const getAttachmentsByTaskId = async (req: Request, res: Response) => {
    const attachments = await taskAttachmentService.getAttachmentsByTaskId(req.params.taskId);
    res.json(attachments);
};

export const updateTaskAttachment = async (req: Request, res: Response) => {
    const updated = await taskAttachmentService.updateTaskAttachment(req.params.id, req.body);
    res.json(updated);
};

export const deleteTaskAttachment = async (req: Request, res: Response) => {
    await taskAttachmentService.deleteTaskAttachment(req.params.id);
    res.status(204).send();
};
