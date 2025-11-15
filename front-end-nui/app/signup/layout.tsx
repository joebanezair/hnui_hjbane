"use client";
import { Navbar } from "@/components/navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // ✅ If token exists, redirect to dashboard
      router.push("/dashboard");
    }
    // ❌ If no token, do nothing (stay on login)
  }, [router]);

  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          {children}
        </div>
      </section>
    </>
  );
}
