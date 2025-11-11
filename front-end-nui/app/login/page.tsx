"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card } from "@heroui/card";
import { FcGoogle } from "react-icons/fc";
import "./blog.css"; // optional for responsive styles

export default function LoginPage() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     alert("Please enter both email and password");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.error || "Login failed");

  //     localStorage.setItem("token", data.token);

  //     // Optional: fetch profile
  //     const profileRes = await fetch(`${API_BASE_URL}/auth/profile`, {
  //       headers: { Authorization: `Bearer ${data.token}` },
  //     });
  //     const profile = await profileRes.json();
  //     console.log("User profile:", profile);

  //     window.location.href = "/dashboard";
  //   } catch (error: any) {
  //     console.error("Login error:", error.message);
  //     alert(error.message);
  //   }
  // };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

  const handleLogin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("token", data.token);

    // Optional: fetch profile
    const profileRes = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    const profile = await profileRes.json();
    console.log("User profile:", profile);

    window.location.href = "/dashboard";
  } catch (error: any) {
    alert(error.message);
  }
};

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}>
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "0.75rem",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
        radius="sm"
        shadow="none"
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Signin</h2>

        <Card className="responsive-row" radius="sm" shadow="none">
          <Input
            size="sm"
            isClearable
            radius="sm"
            style={{ flex: 1, minWidth: "140px" }}
            label="Email"
            placeholder="johndoe@gmail.com"
            type="email"
            variant="flat"
            value={email}
            onValueChange={setEmail}
            onClear={() => setEmail("")}
          />
          <Input
            size="sm"
            isClearable
            radius="sm"
            style={{ flex: 1, minWidth: "140px" }}
            label="Password"
            placeholder="Pass*****"
            type="password"
            variant="flat"
            value={password}
            onValueChange={setPassword}
            onClear={() => setPassword("")}
          />
        </Card>

        <Button onClick={handleLogin} color="primary" radius="sm" style={{ width: "100%" }}>
          Sign In
        </Button>

        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            paddingTop: "10px",
            borderTop: "1px dotted lightgray",
          }}
          radius="sm"
          shadow="none"
        >
          <p style={{ fontSize: 14, color: "gray" }}>Need an account?</p>
          <Button
            onClick={() => (window.location.href = "/register")}
            style={{ width: "100%", backgroundColor: "black", color: "white" }}
            radius="sm"
          >
            Sign Up
          </Button>
          <Button variant="bordered" radius="sm" endContent={<FcGoogle />} style={{ width: "100%" }}>
            Sign in with Google
          </Button>
        </Card>
      </Card>
    </div>
  );
}
