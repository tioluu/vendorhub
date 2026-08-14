import express, { Router } from "express";
import { viewCart } from "../customerController/cartController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
 
router.get ("/view-cart", authenticateToken, viewCart);

export default router;