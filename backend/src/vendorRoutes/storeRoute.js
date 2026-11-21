import express from "express";
import {
    viewStores, createStore, deleteStore, customizeStore,
    viewStoreById, publishStore, unpublishStore
} from "../vendorControllers/storeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireStore } from "../middleware/requireStore.js";

const router = express.Router();

router.get("/view-stores", viewStores);
router.get("/view-store/:id", viewStoreById);
router.post("/create-store", authenticateToken, createStore);
router.delete("/delete-store", authenticateToken, requireStore, deleteStore);
router.patch("/customize-store", authenticateToken, requireStore, customizeStore);
router.patch("/unpublish-store", authenticateToken, requireStore, unpublishStore);
router.patch("/publish-store", authenticateToken, requireStore, publishStore);


export default router;
