// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//     }
//   }, []);

//   return <>{children}</>;
// }

"use client"; 
// This tells Next.js that this component runs on the client side (browser).

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Helper function to decode JWT payload (without verifying signature).
// It extracts the middle part of the token (payload) and parses it as JSON.
function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1]; // JWT format: header.payload.signature
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)); // decode Base64 → JSON
    return payload;
  } catch {
    return null; // return null if decoding fails
  }
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 1. Get token from localStorage
    const token = localStorage.getItem("token");

    // 2. If no token → redirect to login
    if (!token) {
      router.push("/login");
      return;
    }

    // 3. Decode token payload
    const decoded = decodeToken(token);

    // 4. If decoding fails or no expiration field → logout
    if (!decoded || !decoded.exp) {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    // 5. Compare expiration time with current time
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    if (decoded.exp < now) {
      // ✅ Token expired → logout
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  // 6. If token is valid and not expired → render children
  return <>{children}</>;
}
