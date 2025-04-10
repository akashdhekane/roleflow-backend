import { Request, Response } from "express";
import * as authService from "../services/authService";

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const result = await authService.loginUser(email, password);
        if (!result) return res.status(401).json({ error: "Invalid email or password" });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Login failed. Please try again later" });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { user, token } = await authService.registerUser(req.body);
        res.status(201).json({ user, token });
    } catch (error: any) {
        if (error.message.includes("already exists")) {
            return res.status(409).json({ error: "Email already registered" });
        }
        res.status(500).json({ error: "Registration failed. Please try again later" });
    }
};
