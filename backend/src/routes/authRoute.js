import express from "express";
import { getCurrentUser, register } from "../controller/authController.js";
import { login } from "../controller/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post ("/register", register);

router.post ("/login", login);

router.get ("/me", authenticateToken, getCurrentUser);

export default router;
