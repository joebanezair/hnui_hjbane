"use client";

import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const FILE_BASE = API_BASE.replace(/\/api$/, "");

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  // --- READ ---
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- CREATE ---
  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const created = await res.json();
      setTasks([...tasks, created]);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // --- UPDATE ---
  const updateTask = async (id: string, updates: any) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // --- DELETE ---
  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Tasks</h2>

      {/* Create Task Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button onClick={createTask}>Add Task</button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <>
              <li key={task._id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", marginBottom: "10px" }}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>

                {/* Update & Delete buttons */}
                <div style={{ marginTop: "10px" }}>
                  {/* Example update: mark as completed */}
                  <button onClick={() => updateTask(task._id, { status: "completed" })}>
                    Mark Completed
                  </button>

                  {/* Example update: edit title/description */}
                  <button
                    onClick={() =>
                      updateTask(task._id, {
                        title: task.title + " (edited)",
                        description: task.description + " (updated)",
                      })
                    }
                    style={{ marginLeft: "10px" }}
                  >
                    Update
                  </button>

                  <button
                    onClick={() => deleteTask(task._id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete
                  </button>
                </div>
              </li>

            </>
          ))}
        </ul>
      )}
    </div>
  );
}


//  <li
//               key={task._id}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 padding: "10px",
//                 marginBottom: "10px",
//               }}
//             >
//               <h3>{task.title}</h3>
//               <p>{task.description}</p>
//               <p>Status: {task.status}</p>
//               <p>
//                 Due:{" "}
//                 {task.dueDate
//                   ? new Date(task.dueDate).toLocaleDateString()
//                   : "N/A"}
//               </p>

//               {/* Attachments */}
//               {task.files && task.files.length > 0 && (
//                 <div style={{ marginTop: "10px" }}>
//                   <strong>Attachments:</strong>
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "10px",
//                       flexWrap: "wrap",
//                       marginTop: "5px",
//                     }}
//                   >
//                     {task.files.map((filePath: string, idx: number) => {
//                       const fileUrl = `${FILE_BASE}/${filePath}`;
//                       const isImage = /\.(png|jpg|jpeg|gif)$/i.test(filePath);

//                       return (
//                         <a
//                           key={idx}
//                           href={fileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           {isImage ? (
//                             <img
//                               src={fileUrl}
//                               alt="attachment"
//                               style={{
//                                 width: "100px",
//                                 height: "100px",
//                                 objectFit: "cover",
//                                 borderRadius: "6px",
//                               }}
//                             />
//                           ) : (
//                             <span>{filePath}</span>
//                           )}
//                         </a>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Update & Delete buttons */}
//               <div style={{ marginTop: "10px" }}>
//                 <button
//                   onClick={() =>
//                     updateTask(task._id, { status: "completed" })
//                   }
//                 >
//                   Mark Completed
//                 </button>
//                 <button
//                   onClick={() => deleteTask(task._id)}
//                   style={{ marginLeft: "10px", color: "red" }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>