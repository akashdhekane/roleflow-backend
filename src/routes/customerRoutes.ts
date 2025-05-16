import { Router } from "express";
import {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from "../controllers/customerController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();
router.use(authenticateToken);

// router.get("/", getAllCustomers);
router.post("/", authorizeRoles("Admin", "Manager", "TeamLead", "SuperAdmin"), createCustomer);
router.post("/", createCustomer);
// Remove this duplicate line: router.post("/", authenticateToken, createCustomer);
// router.put("/:id", authorizeRoles("Admin", "Manager", "TeamLead", "SuperAdmin"), updateCustomer);
router.put("/:id", updateCustomer);
// router.delete("/:id", authorizeRoles("Admin", "Manager", "SuperAdmin"), deleteCustomer);
router.delete("/:id", deleteCustomer);

export default router;
