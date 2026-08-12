import express from "express";
import { viewProduct,createProduct,deleteProduct,editProduct } from "../vendorControllers/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/view-product", viewProduct);
router.post ("/create-product", authenticateToken, createProduct);
router.delete ("/delete-product/:id", authenticateToken, deleteProduct);
router.patch ("/edit-product/:id", authenticateToken, editProduct);

export default router;