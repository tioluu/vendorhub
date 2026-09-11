import express from "express";
import { deleteAccount, getCurrentUser, register } from "../vendorControllers/authController.js";
import { login } from "../vendorControllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post ("/register", register);

router.post ("/login", login);

router.get ("/me", authenticateToken, getCurrentUser);

router.delete("/me", authenticateToken, deleteAccount);

export default router;
