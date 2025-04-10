import { Request, Response } from "express";
import * as departmentService from "../services/departmentService";

export const createDepartment = async (req: Request, res: Response) => {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(department);
};

export const getAllDepartments = async (_req: Request, res: Response) => {
    const departments = await departmentService.getAllDepartments();
    res.json(departments);
};

export const getDepartmentById = async (req: Request, res: Response) => {
    const department = await departmentService.getDepartmentById(req.params.id);
    if (!department) return res.status(404).json({ error: "Department not found" });
    res.json(department);
};

export const updateDepartment = async (req: Request, res: Response) => {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.json(department);
};

export const deleteDepartment = async (req: Request, res: Response) => {
    await departmentService.deleteDepartment(req.params.id);
    res.status(204).send();
};
