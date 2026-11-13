import express from "express";
import {createCategory, viewCategory, deleteCategory} from "../vendorControllers/categoryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-category", authenticateToken, createCategory);
router.get("/view-categories", authenticateToken, viewCategory);
router.delete("/delete-category/:id", authenticateToken, deleteCategory);

export default router;