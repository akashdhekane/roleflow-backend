import * as licensesService from "../services/licensesService";
import { Request, Response } from "express";

export const getAllLicenses = async (_req: Request, res: Response) => {
    try {
        const licenses = await licensesService.getAllLicenses();
        res.json(licenses);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch licenses" });
    }
};

export const getLicenseById = async (req: Request, res: Response) => {
    try {
        const license = await licensesService.getLicenseById(req.params.id);
        if (!license) {
            return res.status(404).json({ error: true, message: "License not found" });
        }
        res.json(license);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch license" });
    }
};

export const createLicense = async (req: Request, res: Response) => {
    try {
        const license = await licensesService.createLicense(req.body);
        res.status(201).json(license);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to create license" });
    }
};

export const updateLicense = async (req: Request, res: Response) => {
    try {
        const license = await licensesService.updateLicense(req.params.id, req.body);
        if (!license) {
            return res.status(404).json({ error: true, message: "License not found" });
        }
        res.json(license);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to update license" });
    }
};

export const deleteLicense = async (req: Request, res: Response) => {
    try {
        await licensesService.deleteLicense(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to delete license" });
    }
};

export const getLicenseAssignments = async (req: Request, res: Response) => {
    try {
        const assignments = await licensesService.getLicenseAssignments(req.params.id);
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: true, message: "Failed to fetch license assignments" });
    }
};

export const assignLicenseToUser = async (req: Request, res: Response) => {
    try {
        const { userId, expires_date, notes } = req.body;
        const assignment = await licensesService.assignLicenseToUser(
            req.params.id,
            userId,
            expires_date,
            notes
        );
        res.status(201).json(assignment);
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to assign license" });
    }
};

export const unassignLicenseFromUser = async (req: Request, res: Response) => {
    try {
        await licensesService.unassignLicenseFromUser(req.params.id, req.params.userId);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: true, message: "Failed to unassign license" });
    }
};