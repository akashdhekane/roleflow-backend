import { Request, Response } from "express";
import * as taskService from "../services/taskService";

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
};

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
};
