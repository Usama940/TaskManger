import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCheck, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Mainpage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      getAllTasks();
    } else {
      setIsLoggedIn(false);
      setTaskData([]);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8800/api/task/tasks",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskData([...taskData, res.data.task]);
      setFormData({ title: "", description: "" });
      setErrors({});
    } catch (err) {
      console.error("Error at task post:", err);
      setError("Error at task post. Please try again.");
    }
  };

  const getAllTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8800/api/task/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskData(res.data);
    } catch (err) {
      console.error("Error while getting tasks:", err);
      setError("Task not found");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:8800/api/task/tasks/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskData(taskData.map((task) => (task._id === id ? res.data : task)));
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Task not found");
    }
  };

  const handleDelete = async (id) => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8800/api/task/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskData(taskData.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const logoutUser = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8800/api/user/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setIsLoggedIn(false);
      setTaskData([]);
      navigate("/");
    } catch (error) {
      console.log("Error while logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div>
        {isLoggedIn ? (
          <button
            onClick={logoutUser}
            className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        )}
      </div>

      <h1 className="text-5xl text-blue-800 font-bold text-center mt-10">
        Welcome to Task Manager
      </h1>

      {/* Add task form */}
      {isLoggedIn && (
        <div className="max-w-xl w-full mt-10 bg-white p-6 rounded-lg shadow-lg">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="title" className="mb-1 font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                className={`border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {errors.title && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="mb-1 font-medium text-gray-700"
              >
                Description
              </label>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                className={`border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                  errors.description
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {errors.description && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.description}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Add Task
            </button>
          </form>
        </div>
      )}

      {/* Task list */}
      <div className="max-w-xl w-full mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">All Tasks</h2>
        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoggedIn && (
          <p className="text-gray-500">Login to see your tasks.</p>
        )}

        <ol className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {taskData.map((task) => (
            <li
              key={task._id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-start hover:shadow-md transition-shadow"
            >
              {editingTaskId === task._id ? (
                <div className="flex-1 pr-4 space-y-2">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleUpdate(task._id, {
                          title: editForm.title,
                          description: editForm.description,
                        })
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 pr-4 max-h-28 overflow-y-auto break-words">
                  <p
                    className={`font-semibold text-lg ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Icons */}
              {editingTaskId !== task._id && (
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() =>
                      handleUpdate(task._id, { status: "completed" })
                    }
                    className="text-green-500 hover:text-green-700"
                    title="Mark Completed"
                  >
                    <FaCheck size={30} />
                  </button>
                  <button
                    onClick={() =>
                      handleUpdate(task._id, { status: "pending" })
                    }
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Mark Pending"
                  >
                    <FaUndo size={30} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTaskId(task._id);
                      setEditForm({
                        title: task.title,
                        description: task.description,
                      });
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit Task"
                  >
                    <FaEdit size={30} />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Task"
                  >
                    <FaTrash size={30} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
