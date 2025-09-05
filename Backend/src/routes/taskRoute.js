import express from "express";
import { protect } from "../middlewere/userAuthmiddle.js";
import {
  postTask,
  getTasks,
  // updateTask,
  // deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/tasks", protect, postTask);
router.get("/tasks", protect, getTasks);
// router.delete("/tasks:id", protect, deleteTask);
// router.put("/tasks:id", protect, updateTask);

export default router;
