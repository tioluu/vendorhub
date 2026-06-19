import "dotenv/config";
import express from "express";
import prisma from "../lib/prisma.js";
import vendor from "./routes/vendorsRoute.js";
import home from "./routes/homeRoute.js";
import register from "./routes/authRoute.js"
import login from "./routes/authRoute.js"
import forgot_password from "./routes/userRoute.js";
import getCurrentUser from "./routes/authRoute.js";

const app = express();

app.use(express.json());
app.use("/api", vendor);
app.use("/", home);
app.use("/api/auth", register);
app.use("/api/auth", login);
app.use("/api/auth", forgot_password);
app.use("/api/auth", getCurrentUser);


const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});