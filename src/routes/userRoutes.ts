import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/userController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", authorizeRoles("Admin", "Manager"), getAllUsers);
router.get("/:id", getUserById);
router.post("/", authorizeRoles("Admin"), createUser);
router.put("/:id", authorizeRoles("Admin", "Manager"), updateUser);
router.delete("/:id", authorizeRoles("Admin"), deleteUser);

export default router;
