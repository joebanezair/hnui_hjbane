// app/signup/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const router = useRouter();
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

  const handleGoogleSignup = async () => {
    try {
      // Call backend to start Google OAuth
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "GET",
        credentials: "include", // allow cookies if backend uses them
      });

      // Backend should respond with a redirect URL
      const data = await res.json();

      if (data?.redirectUrl) {
        // ✅ Use router to navigate instead of window.location.href
        router.push(data.redirectUrl);
      } else {
        alert("Google signup failed: no redirect URL");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "1rem",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        radius="sm"
        shadow="none"
      >
        <h2 className="text-xl font-bold">Sign Up</h2>

        <Button
          variant="bordered"
          radius="sm"
          endContent={<FcGoogle />}
          style={{ width: "100%" }}
          onClick={handleGoogleSignup}
        >
          Sign up with Google
        </Button>

        <Button
          onClick={() => router.push("/login")}
          style={{ width: "100%", backgroundColor: "black", color: "white" }}
          radius="sm"
        >
          Already have an account? Login
        </Button>
      </Card>
    </div>
  );
}
