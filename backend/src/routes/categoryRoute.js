import express from "express";
import {createCategory, viewCategory} from "../controller/categoryController.js";

const router = express.Router();

router.post("/create-category", createCategory);
router.get("/view-categories", viewCategory);

export default router;