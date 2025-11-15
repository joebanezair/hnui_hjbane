"use client";

import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const FILE_BASE = API_BASE.replace(/\/api$/, "");

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }
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

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "N/A"}
              </p>

              {task.files && task.files.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Attachments:</strong>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "5px",
                    }}
                  >
                    {task.files.map((filePath: string, idx: number) => {
                      const fileUrl = `${FILE_BASE}/${filePath}`;
                      const isImage = /\.(png|jpg|jpeg|gif)$/i.test(filePath);

                      return (
                        <a
                          key={idx}
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {isImage ? (
                            <img
                              src={fileUrl}
                              alt="attachment"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          ) : (
                            <span>{filePath}</span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// "use client"; // Next.js client component

// import { useEffect, useState } from "react";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// export default function TaskList() {
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE}/tasks`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error("Failed to fetch tasks");
//         }

//         const data = await res.json();
//         setTasks(data);
//       } catch (err) {
//         console.error("Error fetching tasks:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   if (loading) return <p>Loading tasks...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>My Tasks</h2>
//       {tasks.length === 0 ? (
//         <p>No tasks found.</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {tasks.map((task) => (
//             <li
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
//                       // Build proper URL (backend serves /uploads statically)
//                       const fileUrl = `${API_BASE.replace("/api", "")}/${filePath}`;

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
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
 