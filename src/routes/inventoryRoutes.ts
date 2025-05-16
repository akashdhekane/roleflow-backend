import { Router } from "express";
import * as inventoryController from "../controllers/inventoryController";

const router = Router();

router.get("/", inventoryController.getAllInventory);
router.get("/:id", inventoryController.getInventoryById);
router.post("/", inventoryController.createInventory);
router.patch("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);
router.patch("/:id/quantity", inventoryController.updateInventoryQuantity);

export default router;
