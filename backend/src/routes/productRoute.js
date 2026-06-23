import express from "express";
import { viewProduct } from "../controller/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/view_product", viewProduct);

export default router;