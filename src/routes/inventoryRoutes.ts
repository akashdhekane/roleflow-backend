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
router.post("/", createInventoryItem);
// router.post("/", authorizeRoles("Admin", "Manager", "TeamLead"), createInventoryItem);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

export default router;
