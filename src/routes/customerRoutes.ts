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

router.get("/", getAllCustomers);
router.post("/", authorizeRoles("Admin", "Manager", "TeamLead", "SuperAdmin"), createCustomer);
// Remove this duplicate line: router.post("/", authenticateToken, createCustomer);
router.put("/:id", authorizeRoles("Admin", "Manager", "TeamLead"), updateCustomer);
router.delete("/:id", authorizeRoles("Admin", "Manager"), deleteCustomer);

export default router;
