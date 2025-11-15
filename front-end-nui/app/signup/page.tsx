"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card } from "@heroui/card";
import { FcGoogle } from "react-icons/fc";
import "./blog.css";
import { SignupTextData } from "@/apptexts/TextAndLanguage";
import { useRouter } from "next/navigation"; 

export default function SignUPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem("token", data.token);
      console.log("Registration successful:", data.token);
      window.location.href = "/login"; // ✅ redirect to login page
    } catch (error: any) {
      console.error("Registration error:", error.message);
      alert(error.message);
    }
  };

  const signTxt = SignupTextData;

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
          gap: "0.5rem",
        }}
        radius="sm"
        shadow="none"
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{signTxt.SignupButton}</h2>

        <Card className="responsive-row" radius="sm" shadow="none">
          <Input
            size="sm"
            isClearable
            radius="sm"
            style={{ flex: 1, minWidth: "140px" }}
            label="First Name"
            placeholder="John"
            type="text"
            variant="flat"
            value={firstName}
            onValueChange={setFirstName}
            onClear={() => setFirstName("")}
          />
          <Input
            size="sm"
            isClearable
            radius="sm"
            style={{ flex: 1, minWidth: "140px" }}
            label="Last Name"
            placeholder="Doe"
            type="text"
            variant="flat"
            value={lastName}
            onValueChange={setLastName}
            onClear={() => setLastName("")}
          />
        </Card>

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

        <Card style={{ paddingTop: 10, paddingBottom: 10 }} radius="sm" shadow="none">
          <Button onClick={handleRegister} color="primary" radius="sm" style={{ width: "100%" }}>
            Sign Up
          </Button>
        </Card>

        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            paddingTop: "10px",
            borderTop: "1px dotted lightgray",
          }}
          radius="none"
          shadow="none"
        >
          <p style={{ fontSize: 14, color: "gray" }}>Already have an account?</p>
          <Button
           onClick={() => {
              router.push("/login"); // ✅ go to signup page
            }}
            style={{ width: "100%", backgroundColor: "black", color: "white" }}
            radius="sm"
          >
            Back to Sign In
          </Button>
          <Button variant="bordered"
             onClick={() => {
              router.push("/google"); // ✅ go to signup page
            }}
            radius="sm" endContent={<FcGoogle />} style={{ width: "100%" }}>
            Sign up with Google
          </Button>
        </Card>
      </Card>
    </div>
  );
}
 