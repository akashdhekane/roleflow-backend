import * as inventoryService from "../services/inventoryService";
import { Request, Response } from "express";

export const getAllInventory = async (_req: Request, res: Response) => {
    try {
        const items = await inventoryService.getAllInventory();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch inventory items" });
    }
};

export const getInventoryById = async (req: Request, res: Response) => {
    try {
        const item = await inventoryService.getInventoryById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: true, message: "Inventory item not found" });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch inventory item" });
    }
};

export const createInventory = async (req: Request, res: Response) => {
    try {
        const item = await inventoryService.createInventory(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to create inventory item" });
    }
};

export const updateInventory = async (req: Request, res: Response) => {
    try {
        const item = await inventoryService.updateInventory(req.params.id, req.body);
        if (!item) {
            return res.status(404).json({ error: true, message: "Inventory item not found" });
        }
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to update inventory item" });
    }
};

export const deleteInventory = async (req: Request, res: Response) => {
    try {
        await inventoryService.deleteInventory(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to delete inventory item" });
    }
};

export const updateInventoryQuantity = async (req: Request, res: Response) => {
    try {
        const item = await inventoryService.updateInventoryQuantity(req.params.id, req.body.quantity);
        if (!item) {
            return res.status(404).json({ error: true, message: "Inventory item not found" });
        }
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to update inventory quantity" });
    }
};
