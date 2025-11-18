"use client"
export function logoutWithRouter() {
  localStorage.removeItem("token");
  window.location.href = "/login"
}

