import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
import { connectDB } from "./src/lib/db.js";
import userAuthRoute from "./src/routes/userAuthRoute.js";
import taskRoute from "./src/routes/taskRoute.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/user", userAuthRoute);
app.use("/api/task", taskRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
