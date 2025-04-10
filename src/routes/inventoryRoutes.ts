import { Router } from "express";
import {
    getAllInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} from "../controllers/inventoryController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getAllInventoryItems);
router.get("/:id", getInventoryItemById);
router.post("/", authorizeRoles("Admin", "Manager", "TeamLead"), createInventoryItem);
router.put("/:id", authorizeRoles("Admin", "Manager", "TeamLead"), updateInventoryItem);
router.delete("/:id", authorizeRoles("Admin", "Manager"), deleteInventoryItem);

export default router;
