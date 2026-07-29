import express from "express";
import {createCategory, viewCategory, deleteCategory} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create-category", createCategory);
router.get("/view-categories", viewCategory);
router.delete("/delete-category/:id", deleteCategory);

export default router;