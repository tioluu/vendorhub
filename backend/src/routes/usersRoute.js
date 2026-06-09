import express from "express";
import {getUser} from "../controller/userController.js"

const router = express.Router();

router.get("/users", getUser);

export default router;