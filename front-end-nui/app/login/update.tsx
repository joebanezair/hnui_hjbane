"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { Toast, addToast } from "@heroui/toast";
import { Form } from "@heroui/form";
import { Card } from "@heroui/card";
import { SignupTextData } from "@/apptexts/TextAndLanguage";
import { useRouter } from "next/navigation";
import "./blog.css";
import { Divider } from "@heroui/divider";
import { FcGoogle } from "react-icons/fc";
import { LoginTextData } from "@/apptexts/TextAndLanguage"
// Define shape of form data
interface FormDataShape {
  email: string;
  password: string;
  terms?: string;
}

// HeroUI expects ValidationErrors as { [key: string]: string }
type ValidationErrors = {
  [key: string]: string;
};

export default function UpdateSignIn() {
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [submitted, setSubmitted] = useState<FormDataShape | null>(null);

  const router = useRouter();
  // Real-time password validation
  const getPasswordError = (value: string): string | null => {
    if (value.length < 4) {
      return "Password must be 4 characters or more";
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return "Password needs at least 1 uppercase letter";
    }
    if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return "Password needs at least 1 symbol";
    }
    return null;
  };

  const handleLoginFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const maindata: FormDataShape = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      terms: formData.get("terms") as string | undefined,
    };
    const newErrors: ValidationErrors = {};
    // Password validation
    const passwordError = getPasswordError(maindata.password);
    if (passwordError) newErrors.password = passwordError;
    // Terms validation
    if (maindata.terms !== "true") newErrors.terms = "Please accept the terms";
    if (Object.keys(newErrors).length > 0) {setErrors(newErrors); return;}
    
    // Clear errors and submit
    setErrors({});
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: maindata.email,
          password: maindata.password,
          terms: maindata.terms
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login Failed");
      localStorage.setItem("token", data.token);
      addToast({
        title: `Login Successful!`,
        description: `Loging in...`,
        variant: "solid",
        color: "primary",
      });
      router.push("/dashboard");
    } catch (error: any) {
      addToast({
        title: "Login Attempt Failed",
        description: error.message || "Login Failed",
        variant: "solid",
        color: "danger",
      });
      return;
    }

  }

  return (
    <Form
      className="w-full justify-center items-center space-y-4"
      validationErrors={errors}
      onReset={() => setSubmitted(null)}
      onSubmit={handleLoginFunction}
    >
      <div className="flex flex-col gap-4 max-w-md">
        {/* Email */}
        <div className="responsive-row">
          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your email";
              }
              if (validationDetails.typeMismatch) {
                return "Please enter a valid email address";
              }
              return errors.email;
            }}
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
          />

          {/* Password */}
          <Input
            isRequired
            errorMessage={getPasswordError(password) || errors.password}
            isInvalid={getPasswordError(password) !== null}
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onValueChange={setPassword}
          />
        </div>

        {/* Terms */}
        <Checkbox
          isRequired
          classNames={{ label: "text-small" }}
          isInvalid={!!errors.terms}
          name="terms"
          validationBehavior="aria"
          value="true"
          onValueChange={() =>
            setErrors((prev) => {
              const { terms, ...rest } = prev;
              return rest;
            })
          }
        >
          I agree to the terms and conditions
        </Checkbox>

        {errors.terms && (
          <span className="text-danger text-small">{errors.terms}</span>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <Button className="w-fit" color="primary" type="submit">
            {LoginTextData.LoginButton}
          </Button>
          <Button type="reset" variant="bordered">
            Reset
          </Button>
        </div>
      </div>

      <Divider />
      
        <p style={{ fontSize: 14, color: "gray" }}>Already have an account?</p>
        <div className="responsive-row px-2">
          <Button
            onClick={() => {
              router.push("/signup"); // ✅ go to signup page
            }}
            style={{ backgroundColor: "black", color: "white" }}
            radius="sm"
          >
            {LoginTextData.SignupButton}
          </Button>
          <Button variant="bordered" onClick={() => {
            router.push("/google"); // ✅ go to signup page
          }} radius="sm" endContent={<FcGoogle />} style={{ }}>
            {LoginTextData.SignInWithGoogle}
          </Button>
        </div>

    </Form>
  );
}
