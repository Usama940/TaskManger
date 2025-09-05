import taskModel from "../models/task.model";

export const postTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || title.length === 0) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || description.length === 0) {
      return res.status(400).json({ message: "Description is required" });
    }
  } catch (error) {
    console.log("error at the task posting ", error);
    return res.status(500).json("internal server error at task posting ");
  }
};
