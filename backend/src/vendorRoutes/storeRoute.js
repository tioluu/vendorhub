import express from "express";
import { viewStores, createStore, deleteStore, customizeStore, 
    viewStoreById, publishStore, unpublishStore} from "../vendorControllers/storeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/view-stores", viewStores);
router.get ("/view-store/:id", viewStoreById);
router.post ("/create-store", authenticateToken, createStore);
router.delete ("/delete-store", authenticateToken, deleteStore);
router.patch ("/customize-store", authenticateToken, customizeStore);
router.patch ("/unpublish-store", authenticateToken, unpublishStore);
router.patch ("/publish-store", authenticateToken, publishStore);


export default router;
