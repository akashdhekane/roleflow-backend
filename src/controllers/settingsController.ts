import * as settingsService from "../services/settingsService";
import { Request, Response } from "express";

export const getAllSettings = async (req: Request, res: Response) => {
    try {
        const settings = await settingsService.getAllSettings();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const getSettingByKey = async (req: Request, res: Response) => {
    try {
        const setting = await settingsService.getSettingByKey(req.params.key);
        if (!setting) return res.status(404).json({ error: "Setting not found" });
        res.json(setting);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const updateMultipleSettings = async (req: Request, res: Response) => {
    try {
        const updated = await settingsService.updateMultipleSettings(req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const updateSettingByKey = async (req: Request, res: Response) => {
    try {
        const updated = await settingsService.updateSettingByKey(req.params.key, req.body.value);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};

export const deleteSettingByKey = async (req: Request, res: Response) => {
    try {
        const result = await settingsService.deleteSettingByKey(req.params.key);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};