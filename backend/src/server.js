import "dotenv/config";
import express from "express";
import prisma from "../lib/prisma.js";
import authRoutes from "./routes/authRoute.js";
import homeRoutes from "./routes/homeRoute.js";
import storeRoutes from "./routes/storeRoute.js";
import productRoutes from "./routes/productRoute.js";
import userRoutes from "./routes/userRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";

const app = express();

app.use(express.json());
app.use("/api", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);


const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});