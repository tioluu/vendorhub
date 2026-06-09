import "dotenv/config";
import express from "express";
import prisma from "../lib/prisma.js";
import vendor from "./routes/vendorsRoute.js";
import home from "./routes/homeRoute.js";
import getUser from "./routes/usersRoute.js";
import auth from "./routes/auth.js"

const app = express();

app.use(express.json());
app.use("/", vendor);
app.use("/", home);
app.use("/", getUser);
app.use("/auth", auth);


const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});