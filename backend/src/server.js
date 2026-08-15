import "dotenv/config";
import express from "express";
import prisma from "../lib/prisma.js";
import authRoutes from "./vendorRoutes/authRoute.js";
import homeRoutes from "./vendorRoutes/homeRoute.js";
import storeRoutes from "./vendorRoutes/storeRoute.js";
import productRoutes from "./vendorRoutes/productRoute.js";
import userRoutes from "./vendorRoutes/userRoute.js";
import categoryRoutes from "./vendorRoutes/categoryRoute.js";
import cartRoutes from "./customerRoute/cartRoute.js";

const app = express();

app.use(express.json());
app.use("/api", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);


const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});