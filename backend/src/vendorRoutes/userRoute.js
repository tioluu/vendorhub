import express from "express";
import { forgot_password } from "../vendorControllers/userController.js";

const router = express.Router();

router.post("/forgot-password", forgot_password);

export default router;
