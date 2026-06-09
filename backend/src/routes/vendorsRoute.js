import express from "express";
import { vendors } from "../controller/vendorsController.js";

const router = express.Router();

router.get("/vendors", vendors)

export default router;