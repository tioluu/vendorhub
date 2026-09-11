import express, { Router } from "express";
import { viewCart } from "../customerController/cartController.js";

const router = express.Router();
 
router.get ("/view-cart", viewCart);

export default router;