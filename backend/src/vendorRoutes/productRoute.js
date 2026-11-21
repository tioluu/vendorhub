import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
    viewProduct, createProduct, uploadProductImage, deleteProduct, editProduct,
    publishProduct, unpublishProduct
} from "../vendorControllers/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireStore } from "../middleware/requireStore.js";
import { requireProduct } from "../middleware/requireProduct.js";

const router = express.Router();

router.get("/view-product", viewProduct);
router.post("/create-product", authenticateToken, requireStore, createProduct);
router.post("/upload-image/:id", authenticateToken, requireStore, requireProduct, upload.single("image"), uploadProductImage);
router.delete("/delete-product/:id", authenticateToken, requireStore, requireProduct, deleteProduct);
router.patch("/edit-product/:id", authenticateToken, requireStore, requireProduct, editProduct);
router.patch("/publish-product/:id", authenticateToken, requireStore, requireProduct, publishProduct);
router.patch("/unpublish-product/:id", authenticateToken, requireStore, requireProduct, unpublishProduct);

export default router;