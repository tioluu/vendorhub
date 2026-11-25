import express from "express";
import {
  createCategory,
  viewCategory,
  deleteCategory,
} from "../vendorControllers/categoryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireStore } from "../middleware/requireStore.js";

const router = express.Router();

router.post(
  "/create-category",
  authenticateToken,
  requireStore,
  createCategory,
);
router.get("/view-categories", authenticateToken, requireStore, viewCategory);
router.delete(
  "/delete-category/:id",
  authenticateToken,
  requireStore,
  deleteCategory,
);

export default router;
