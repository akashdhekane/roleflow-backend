import { Request, Response } from "express";
import * as taskService from "../services/taskService";

export const getAllTasks = async (_req: Request, res: Response) => {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
};

export const createTask = async (req: Request, res: Response) => {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json(newTask);
};

export const updateTask = async (req: Request, res: Response) => {
    const updated = await taskService.updateTask(req.params.id, req.body);
    res.json(updated);
};

export const deleteTask = async (req: Request, res: Response) => {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
};
