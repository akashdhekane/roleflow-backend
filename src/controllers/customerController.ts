import { Request, Response } from "express";
import * as customerService from "../services/customerService";

export const getAllCustomers = async (_req: Request, res: Response) => {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
};

export const getCustomerById = async (req: Request, res: Response) => {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
};

export const createCustomer = async (req: Request, res: Response) => {
    const newCustomer = await customerService.createCustomer(req.body);
    res.status(201).json(newCustomer);
};

export const updateCustomer = async (req: Request, res: Response) => {
    const updated = await customerService.updateCustomer(req.params.id, req.body);
    res.json(updated);
};

export const deleteCustomer = async (req: Request, res: Response) => {
    await customerService.deleteCustomer(req.params.id);
    res.status(204).send();
};
