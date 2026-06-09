import "dotenv/config";
import express from "express";
import prisma from "../lib/prisma.js";
import vendor from "./routes/vendors.js";
import home from "./routes/home.js";
import user from "./routes/usersRoute.js";
import auth from "./routes/auth.js"

const app = express();

app.use(express.json());
app.use("/vendor", vendor);
app.use("/", home);
app.use("/", user);
app.use("/auth", auth);


const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});