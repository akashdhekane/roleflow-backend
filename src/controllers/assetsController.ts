import * as assetsService from "../services/assetsService";
import { Request, Response } from "express";

export const getAllAssets = async (_req: Request, res: Response) => {
    try {
        const assets = await assetsService.getAllAssets();
        res.json(assets);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch assets" });
    }
};

export const getAssetById = async (req: Request, res: Response) => {
    try {
        const asset = await assetsService.getAssetById(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: true, message: "Asset not found" });
        }
        res.json(asset);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch asset" });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    try {
        const asset = await assetsService.createAsset(req.body);
        res.status(201).json(asset);
    } catch (err) {
        console.error("Create Asset Error:", err); // <-- Add this line
        res.status(400).json({ error: true, message: "Failed to create asset" });
    }
};

export const updateAsset = async (req: Request, res: Response) => {
    try {
        const asset = await assetsService.updateAsset(req.params.id, req.body);
        if (!asset) {
            return res.status(404).json({ error: true, message: "Asset not found" });
        }
        res.json(asset);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to update asset" });
    }
};

export const deleteAsset = async (req: Request, res: Response) => {
    try {
        await assetsService.deleteAsset(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to delete asset" });
    }
};

export const getAssetMaintenanceRecords = async (req: Request, res: Response) => {
    try {
        const records = await assetsService.getAssetMaintenanceRecords(req.params.id);
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch maintenance records for asset" });
    }
};