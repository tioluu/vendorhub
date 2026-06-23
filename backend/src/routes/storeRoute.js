import express from "express";
import { viewStore, createStore, deleteStore } from "../controller/storeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/view_store", viewStore);
router.post ("/create_store", authenticateToken, createStore);
router.delete ("/delete_store", authenticateToken, deleteStore);


export default router;
