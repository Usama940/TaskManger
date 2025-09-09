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

export const updateTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: taskId } = req.params;
    const { title, description, status } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    if (!taskId) {
      return res.status(400).json({ message: "Task ID missing" });
    }

    // Only allow updating these fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: taskId, user: userId.toString() },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error at updateTask:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error while updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    let { id: taskId } = req.params;

    if (!userId || !taskId) {
      return res
        .status(400)
        .json({ message: "Task ID and User ID are required" });
    }

    const deletedTask = await taskModel.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      deletedTask,
    });
  } catch (error) {
    console.error("Error at deleteTask:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while deleting task" });
  }
};
