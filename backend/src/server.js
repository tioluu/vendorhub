import "dotenv/config";
import express from "express";
import prisma from "../lib/prisma.js";
import vendor from "./routes/vendorsRoute.js";
import home from "./routes/homeRoute.js";
import getUser from "./routes/usersRoute.js";
import register from "./routes/authRoute.js"
import login from "./routes/authRoute.js"

const app = express();

app.use(express.json());
app.use("/api", vendor);
app.use("/", home);
app.use("/api", getUser);
app.use("/api", register);
app.use("/api", login);


const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});