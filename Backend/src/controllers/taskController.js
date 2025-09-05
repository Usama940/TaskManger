import taskModel from "../models/task.model.js";
import User from "../models/userAuth.model.js";

export const postTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || description.trim().length === 0) {
      return res.status(400).json({ message: "Description is required" });
    }

    const newTask = new taskModel({
      title,
      description,
      status: "pending",
      user: req.user?._id || null,
    });

    await newTask.save();

    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error at task posting:", error);
    return res
      .status(500)
      .json({ message: "Internal server error at task posting" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const userTasks = await taskModel.find({ user: userId });

    return res.status(200).json(userTasks);
  } catch (error) {
    console.error("Error at task getting:", error);
    return res
      .status(500)
      .json({ message: "Internal server error at task getting" });
  }
};
