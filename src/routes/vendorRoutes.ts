import { Router } from "express";
import {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor,
} from "../controllers/vendorController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getAllVendors);
router.get("/:id", getVendorById);
// router.post("/", authorizeRoles("Admin", "Manager", "TeamLead", "SuperAdmin"), createVendor);
router.post("/", createVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

export default router;
