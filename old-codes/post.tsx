"use client"; // Run this component on the client side

import { useState } from "react";
import { Input, Textarea } from "@heroui/input";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";

export default function PostForm() {
    // State variables for form fields
    const [title, setTitle] = useState(""); // Post title
    const [content, setContent] = useState(""); // Post content
    const [images, setImages] = useState<File[]>([]); // Array of uploaded images

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
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        // Append all selected images
        images.forEach((file) => {
            formData.append("images", file);
        });

        const token = localStorage.getItem("token");

        const res = await fetch("/api/posts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // Attach JWT token
            },
            body: formData,
        });

        const data = await res.json();
        console.log("Post created:", data);
    };

    return (
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
                            {/* Remove button for each image */}
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
                <Spacer y={1.5} />

                {/* Submit button */}
                <Button radius="sm" size="sm" type="submit" color="primary">
                    Create Post
                </Button>
            </form>
        </Card>
    );
}


// "use client";
// import { Input, Textarea } from "@heroui/input";
// import { useState } from "react";
// import { Card } from "@heroui/card";
// import { Button } from "@heroui/button";
// import { Spacer } from "@heroui/spacer";


// export default function PostForm() {
//     // State for title, content, and images (stored as array of File objects)
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const [images, setImages] = useState<File[]>([]);

//     // Handle file selection (append new files to state)
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setImages((prev) => [
//                 ...prev,
//                 ...(e.target.files ? Array.from(e.target.files) : [])
//             ]);

//         }
//     };

//     // Remove image by index
//     const handleRemoveImage = (index: number) => {
//         setImages((prev) => prev.filter((_, i) => i !== index));
//     };

//     // Submit form
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("content", content);

//         // Append all images
//         images.forEach((file) => {
//             formData.append("images", file);
//         });

//         const token = localStorage.getItem("token");

//         const res = await fetch("/api/posts", {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             body: formData,
//         });

//         const data = await res.json();
//         console.log("Post created:", data);
//     };

//     return (
//         <Card className="mw[600px] p-10 m2 auto">
//             <form onSubmit={handleSubmit}>
//                 {/* Title input */}
//                 <Input
//                     label="Title"
//                     placeholder="Enter post title"
//                     value={title}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
//                 />
//                 <Spacer y={1.5} />

//                 {/* Content textarea */}
//                 <Textarea
//                     label="Content"
//                     placeholder="Write your content..."
//                     value={content}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
//                 />
//                 <Spacer y={1.5} />

//                 {/* File input (add images) */}
//                 <Input type="file" multiple onChange={handleFileChange} />
//                 <Spacer y={1.5} />

//                 {/* Preview selected images with remove option */}
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//                     {images.map((file, index) => (
//                         <div key={index} style={{ position: "relative" }}>
//                             {/* Image preview */}
//                             <img
//                                 src={URL.createObjectURL(file)}
//                                 alt={`preview-${index}`}
//                                 style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
//                             />
//                             {/* Remove button */}
//                             <Button
//                                 size="sm"
//                                 color="danger"
//                                 onClick={() => handleRemoveImage(index)}
//                                 style={{ position: "absolute", top: 0, right: 0 }}
//                             >
//                                 ✕
//                             </Button>
//                         </div>
//                     ))}
//                 </div>
//                 <Spacer y={1.5} />

//                 {/* Submit button */}
//                 <Button type="submit" color="primary">
//                     Create Post
//                 </Button>
//             </form>
//         </Card>
//     );
// }
