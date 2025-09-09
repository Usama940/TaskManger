import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Mainpage() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8800/api/task/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and Description required!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8800/api/task/tasks",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks([...tasks, res.data]);
      setFormData({ title: "", description: "" });
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8800/api/task/tasks/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id || t.id === id ? res.data : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task._id || task.id);
    setEditForm({ title: task.title, description: task.description });
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8800/api/task/tasks/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id || t.id === id ? res.data : t)));
      setEditingTask(null);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8800/api/task/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id && t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-600">
        Task Manager
      </h1>

      {/* Add Task Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-6 flex gap-3"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="flex-1 border rounded-lg p-2"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="flex-1 border rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Add
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => {
          const taskId = task._id || task.id;
          const isEditing = editingTask === taskId;

          return (
            <li
              key={taskId}
              className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              {/* Task Info / Edit Mode */}
              {isEditing ? (
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="border rounded p-2"
                  />
                </div>
              ) : (
                <span
                  className={`flex-1 font-medium ${
                    task.status === "completed"
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {task.title} - {task.description}{" "}
                  <span className="italic text-sm text-gray-500">
                    ({task.status})
                  </span>
                </span>
              )}

              {/* Buttons */}
              <div className="flex gap-2 mt-3 sm:mt-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleEditSave(taskId)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(taskId, "completed")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(taskId, "pending")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleEditClick(task)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(taskId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
