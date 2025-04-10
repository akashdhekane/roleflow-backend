import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
};
