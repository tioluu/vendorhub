import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
    viewProduct, createProduct, uploadProductImage, deleteProduct, editProduct,
    publishProduct, unpublishProduct
} from "../vendorControllers/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/view-product", viewProduct);
router.post("/create-product", authenticateToken, createProduct);
router.post("/upload-image/:id", authenticateToken, upload.single("image"), uploadProductImage)
router.delete("/delete-product/:id", authenticateToken, deleteProduct);
router.patch("/edit-product/:id", authenticateToken, editProduct);
router.patch("/publish-product/:id", authenticateToken, publishProduct);
router.patch("/unpublish-product/:id", authenticateToken, unpublishProduct);

export default router;