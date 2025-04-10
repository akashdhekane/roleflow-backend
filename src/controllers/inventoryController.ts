import { Request, Response } from "express";
import * as inventoryService from "../services/inventoryService";

export const getAllInventoryItems = async (_req: Request, res: Response) => {
    const items = await inventoryService.getAllInventoryItems();
    res.json(items);
};

export const getInventoryItemById = async (req: Request, res: Response) => {
    const item = await inventoryService.getInventoryItemById(req.params.id);
    if (!item) return res.status(404).json({ error: "Inventory item not found" });
    res.json(item);
};

export const createInventoryItem = async (req: Request, res: Response) => {
    const newItem = await inventoryService.createInventoryItem(req.body);
    res.status(201).json(newItem);
};

export const updateInventoryItem = async (req: Request, res: Response) => {
    const updated = await inventoryService.updateInventoryItem(req.params.id, req.body);
    res.json(updated);
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
    await inventoryService.deleteInventoryItem(req.params.id);
    res.status(204).send();
};
