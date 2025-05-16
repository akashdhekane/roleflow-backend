import * as userPermissionsService from "../services/userPermissionsService";
import { Request, Response } from "express";

export const checkUserPermission = async (req: Request, res: Response) => {
    const { userId, permissionId } = req.params;
    const result = await userPermissionsService.checkUserPermission(userId, permissionId);
    if (result.error) {
        return res.status(result.status || 400).json(result);
    }
    res.json(result);
};

export const getUserPermissions = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await userPermissionsService.getUserPermissions(userId);
    if (result.error) {
        return res.status(result.status || 400).json(result);
    }
    res.json(result);
};

export const getPermissionDefinitions = async (_req: Request, res: Response) => {
    const permissions = await userPermissionsService.getPermissionDefinitions();
    res.json({ permissions });
};

export const getAllRolePermissions = async (_req: Request, res: Response) => {
    try {
        const data = await userPermissionsService.getAllRolePermissions();
        res.json({ data });
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err instanceof Error ? err.message : String(err),
            status: 400
        });
    }
};

export const updateRolePermissions = async (req: Request, res: Response) => {
    try {
        const data = await userPermissionsService.updateRolePermissions(req.body);
        res.json({
            data,
            message: "Role permissions updated successfully"
        });
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err instanceof Error ? err.message : String(err),
            status: 400
        });
    }
};