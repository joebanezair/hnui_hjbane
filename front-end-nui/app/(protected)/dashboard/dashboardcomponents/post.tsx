"use client"; // Run this component on the client side

import { useState, useRef } from "react";
import { Input, Textarea } from "@heroui/input";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";

export default function PostForm() {
    // State variables for form fields
    const [title, setTitle] = useState(""); // Post title
    const [content, setContent] = useState(""); // Post content
    const [images, setImages] = useState<File[]>([]); // Array of uploaded images
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
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

    return (<>
    
    </>);
}