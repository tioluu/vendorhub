import express from "express";
import { viewStore, createStore, deleteStore, customizeStore, viewStoreById } from "../controller/storeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/view-stores", viewStore);
router.get ("/view-store/:id", viewStoreById);
router.post ("/create-store", authenticateToken, createStore);
router.delete ("/delete-store", authenticateToken, deleteStore);
router.patch ("/customize-store", authenticateToken, customizeStore);


export default router;
