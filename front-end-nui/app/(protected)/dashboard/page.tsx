"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import NavigationBar from "../indoor_components/components/navigationBar";
import { Card } from "@heroui/card";
import PostForm from "./dashboardcomponents/post";
import RetrieveTaskList from "./dashboardcomponents/retrieve";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

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
  }, [API_BASE]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const BodyMain = (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>
          Welcome{profile?.firstName ? `, ${profile.firstName}` : ""}!
        </h1>
        <Button onClick={handleLogout} color="danger" radius="sm">
          Logout
        </Button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {profile ? (
          <div>
            <h3>Profile Info: {API_BASE}</h3>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading profile... {API_BASE}</p>
        )}
      </div>
    </>
  );

  return (
    <>
      <NavigationBar />
      <div style={{ padding: "0rem" }}>
        <div className="flex flex-row gap-0 h-full" style={{ height: "calc(100vh - 64px)" }}>
          <Card className="w-[70%] p-2" style={{}} radius="none" shadow="none">{BodyMain}</Card>
          <div className="w-full p-2">
            <div>
              {PostForm()}
            </div>
            <div>
              {RetrieveTaskList()}
            </div>
          </div>
          <Card className="w-[70%] p-2" style={{}} radius="none" shadow="none">{BodyMain}</Card>
        </div>
      </div>
    </>
  );
}
 