import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();
import { connectDB } from "./src/lib/db.js";
import userAuthRoute from "./src/routes/userAuthRoute.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

connectDB();

app.use("/api/user", userAuthRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
