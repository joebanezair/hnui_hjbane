// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.push("/dashboard"); // ✅ router navigation
    } else {
      router.push("/login");
    }
  }, [router, searchParams]);

  return <p>Signing you in with Google...</p>;
}
