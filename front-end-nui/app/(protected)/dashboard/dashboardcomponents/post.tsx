"use client"; // Run this component on the client side

import { useState, useRef, useEffect } from "react";
import { Input, Textarea } from "@heroui/input";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const FILE_BASE = API_BASE.replace(/\/api$/, "");

export default function PostForm() {
    // State variables for form fields
    const [title, setTitle] = useState(""); // Post title
    const [content, setContent] = useState(""); // Post content
    const [images, setImages] = useState<File[]>([]); // Array of uploaded images
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [tasksComponent, setTasksComponent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    // || "http://localhost:5000/api"

    const clearForm = () => {
        setTitle("");
        setContent("");
        setImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handle file selection (adds new files to state)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages((prev) => [
                ...prev,
                ...(e.target.files ? Array.from(e.target.files) : [])
            ]);

        }
    };
    // Remove image by index
    const handleRemoveImage = (index: number) => {
        setImages((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            // If no images left, also clear the input field
            if (updated.length === 0 && fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return updated;
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", content);

        // Append all selected images
        images.forEach((file) => {
            formData.append("files", file); //images -> files
        });

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/tasks`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // Attach JWT token
            },
            body: formData,
        });

        if (res.ok) {
            alert("Posted successfully!");
            clearForm();
        } else {
            alert("Failed to post. Please try again.");
        }

        const data = await res.json();
        console.log("Post created:", data);
    };

    // inside your component
    const handleClearAllImages = () => {
        setImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    // Fetch Tasks
    // --- READ ---
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch tasks");
            const data = await res.json();
            setTasksComponent(data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);
    // Fetch Tasks

    if (loading) return <p>Loading tasks...</p>;

    const RenderPostForm = () => {
        return (<>
            <Card radius="sm" className="mw[600px] p-2 m2 auto">
                <form onSubmit={handleSubmit}>
                    {/* Title input */}
                    <Input
                        radius="sm"
                        size="sm"
                        label="Title"
                        placeholder="Enter post title"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setTitle(e.target.value)
                        }
                    />
                    <Spacer y={1.5} />

                    {/* Content textarea */}
                    <Textarea
                        radius="sm"
                        size="sm"
                        label="Content"
                        placeholder="Write your content..."
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setContent(e.target.value)
                        }
                    />
                    <Spacer y={1.5} />

                    {/* File input for multiple images */}
                    <Input
                        radius="sm"
                        size="sm"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                    <Spacer y={1.5} />

                    {/* Preview selected images with remove option */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {images.map((file, index) => (
                            <div key={index} style={{ position: "relative" }}>
                                {/* Image preview thumbnail */}
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${index}`}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                                {/* Remove button */}
                                <Button
                                    radius="sm"
                                    size="sm"
                                    color="danger"
                                    onClick={() => handleRemoveImage(index)}
                                    style={{ position: "absolute", top: 0, right: 0 }}
                                >
                                    ✕
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Optional clear all button */}
                    {images.length > 0 && (
                        <Button
                            radius="sm"
                            size="sm"
                            color="secondary"
                            onClick={handleClearAllImages}
                            style={{ marginTop: "10px" }}
                        >
                            Clear All
                        </Button>
                    )}
                    <Spacer y={1.5} />

                    {/* Submit button */}
                    <Button radius="sm" size="sm" type="submit" color="primary">
                        Create Post
                    </Button>
                </form>
            </Card>
        </>);
    }
    const RetrieveTaskData = () => {
        return (<>
            <div>
                <div>My Tasks : </div>
                <div className="p-2" style={{ }}>
                    {tasksComponent.length === 0 ? (
                        <p>No tasks found.</p>
                    ) : (<>
                        {tasksComponent.map((taskRetrieve: any) => (
                            <Card key={taskRetrieve._id} radius="none" className="mw[600px] p-2 m2 auto mt-2">
                                <h3>{taskRetrieve.title}</h3>
                                <p>{taskRetrieve.description}</p>
                                <p>Status: {taskRetrieve.status}</p>
                                {taskRetrieve.files.length > 0 ? (
                                    <>
                                        {taskRetrieve.files.map((filePath: string, idx: number) => {
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
                                    </>
                                ) : (
                                    <div>No files posted</div>
                                )}

                            </Card>
                        ))}
                    </>)}
                </div>
            </div>
        </>);
    }


    return (<>
        {RenderPostForm()}
        {RetrieveTaskData()}
    </>);
}