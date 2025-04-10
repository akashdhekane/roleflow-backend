import { Request, Response } from "express";
import * as authService from "../services/authService";

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    if (!result) return res.status(401).json({ error: "Invalid credentials" });
    res.json(result);
};

export const registerUser = async (req: Request, res: Response) => {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
};
