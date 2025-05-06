import * as permissionsService from "../services/permissionsService";
import { Request, Response } from "express";

export const getAllPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await permissionsService.getAllPermissions();
        res.json({ permissions });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const getAllRoles = async (req: Request, res: Response) => {
    try {
        const roles = await permissionsService.getAllRoles();
        res.json({ roles });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const getRolePermissions = async (req: Request, res: Response) => {
    try {
        const result = await permissionsService.getRolePermissions(req.params.roleId);
        if (!result) return res.status(404).json({ error: "Role not found" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};