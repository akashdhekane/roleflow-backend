import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser); // You may disable this in production

export default router;
