import express from "express";
import { viewProduct,createProduct,deleteProduct } from "../controller/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/view-product", viewProduct);
router.post ("/create-product", authenticateToken, createProduct);
router.delete ("/delete-product/:id", authenticateToken, deleteProduct);

export default router;