import express from "express";
import { viewStore, createStore, deleteStore, customizeStore } from "../controller/storeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/view-store", viewStore);
router.post ("/create-store", authenticateToken, createStore);
router.delete ("/delete-store", authenticateToken, deleteStore);
router.patch ("/customize-store", authenticateToken, customizeStore);


export default router;
