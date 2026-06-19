import express from "express";
import { forgot_password } from "../controller/userController.js";

const router = express.Router();

router.post ("/forgot_password", forgot_password);

export default router;