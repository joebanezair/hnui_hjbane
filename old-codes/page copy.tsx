"use client";
import { useRouter } from "next/navigation"; // ✅ correct import
import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card } from "@heroui/card";
import { FcGoogle } from "react-icons/fc";
import "./blog.css";
import { LoginTextData } from "@/apptexts/TextAndLanguage"
import UpdateSignIn from "./update";
import { Divider } from "@heroui/divider";

export default function LoginPage() {
  const router = useRouter();
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

      // Navigate to dashboard without reload
      router.push("/dashboard"); // ✅ use router instead of window.location.href
    } catch (error: any) {
      alert(error.message);
    }
  };

  const PreviousLogin = () => {
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
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{LoginTextData.LoginButton}</h2>

          <Card className="responsive-row p-1" radius="sm" shadow="none">
            <Input
              size="sm"
              isClearable
              radius="sm"
              style={{ flex: 1, minWidth: "140px" }}
              label={LoginTextData.EmailPlaceholder}

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
              label={LoginTextData.PasswordPlaceholder}
              placeholder="Pass*****"
              type="password"
              variant="flat"
              value={password}
              onValueChange={setPassword}
              onClear={() => setPassword("")}
            />
          </Card>

          <Card className="p-1" shadow="none" radius="sm">
            <Button onClick={handleLogin} color="primary" radius="sm" style={{ width: "100%" }}>
              {LoginTextData.LoginButton}
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
            className="p-1"
          >
            <p style={{ fontSize: 14, color: "gray" }}>{LoginTextData.NeedAnAccount}</p>
            <Button
              onClick={() => {
                router.push("/signup"); // ✅ go to signup page
              }}
              style={{ width: "100%", backgroundColor: "black", color: "white" }}
              radius="sm"
            >
              {LoginTextData.SignupButton}
            </Button>
            <Button variant="bordered" onClick={() => {
              router.push("/google"); // ✅ go to signup page
            }} radius="sm" endContent={<FcGoogle />} style={{ width: "100%" }}>
              {LoginTextData.SignInWithGoogle}
            </Button>
          </Card>
        </Card>
      </div>
    );
  }

  return (<>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "left" }} className="mb-3">{LoginTextData.LoginButton}</h2>
      <UpdateSignIn />
  </>);
} 