"use client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button"; // Optional: remove if not using HeroUI
import { Navbar } from "../indoor_components/components/navbar";
import { logoutWithRouter } from "../indoor_components/components/logoutWithRouter";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const API_BASE = process.env.API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (<>
    <Navbar />
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>
          Welcome{profile?.firstName ? `, ${profile.firstName}` : ""}!
        </h1>
        <Button onClick={logoutWithRouter} color="danger" radius="sm">
          Logout
        </Button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {profile ? (
          <div>
            <h3>Profile Info:  {process.env.API_BASE_URL}</h3>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading profile... {API_BASE}</p>
        )}
      </div>
    </div>
  </>);
}
