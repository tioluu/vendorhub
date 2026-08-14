import express from "express";
import { forgot_password } from "../vendorControllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post ("/forgot-password", forgot_password);

export default router;