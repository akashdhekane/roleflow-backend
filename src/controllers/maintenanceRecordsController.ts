import * as maintenanceRecordsService from "../services/maintenanceRecordsService";
import { Request, Response } from "express";

export const getAllMaintenanceRecords = async (_req: Request, res: Response) => {
    try {
        const records = await maintenanceRecordsService.getAllMaintenanceRecords();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch maintenance records" });
    }
};

export const getMaintenanceRecordById = async (req: Request, res: Response) => {
    try {
        const record = await maintenanceRecordsService.getMaintenanceRecordById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: true, message: "Maintenance record not found" });
        }
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch maintenance record" });
    }
};

export const createMaintenanceRecord = async (req: Request, res: Response) => {
    try {
        const record = await maintenanceRecordsService.createMaintenanceRecord(req.body);
        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to create maintenance record" });
    }
};

export const updateMaintenanceRecord = async (req: Request, res: Response) => {
    try {
        const record = await maintenanceRecordsService.updateMaintenanceRecord(req.params.id, req.body);
        if (!record) {
            return res.status(404).json({ error: true, message: "Maintenance record not found" });
        }
        res.json(record);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to update maintenance record" });
    }
};

export const deleteMaintenanceRecord = async (req: Request, res: Response) => {
    try {
        await maintenanceRecordsService.deleteMaintenanceRecord(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to delete maintenance record" });
    }
};