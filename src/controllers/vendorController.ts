import { Request, Response } from "express";
import * as vendorService from "../services/vendorService";

export const getAllVendors = async (_req: Request, res: Response) => {
    const vendors = await vendorService.getAllVendors();
    res.json(vendors);
};

export const getVendorById = async (req: Request, res: Response) => {
    const vendor = await vendorService.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
};

export const createVendor = async (req: Request, res: Response) => {
    const newVendor = await vendorService.createVendor(req.body);
    res.status(201).json(newVendor);
};

export const updateVendor = async (req: Request, res: Response) => {
    const updated = await vendorService.updateVendor(req.params.id, req.body);
    res.json(updated);
};

export const deleteVendor = async (req: Request, res: Response) => {
    await vendorService.deleteVendor(req.params.id);
    res.status(204).send();
};
