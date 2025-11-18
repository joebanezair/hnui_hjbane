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

// Define shape of form data
interface FormDataShape {
  name: string;
  lastname: string;
  email: string;
  password: string;
  terms?: string;
}

// HeroUI expects ValidationErrors as { [key: string]: string }
type ValidationErrors = {
  [key: string]: string;
};

export default function UpdateSignUp() {
  const [password, setPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState<FormDataShape | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const maindata: FormDataShape = {
      name: formData.get("name") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      terms: formData.get("terms") as string | undefined,
    };

    const newErrors: ValidationErrors = {};

    // Password validation
    const passwordError = getPasswordError(maindata.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Username validation
    if (maindata.name === "admin") {
      newErrors.name = "Nice try! Choose a different username";
    }

    // Terms validation
    if (maindata.terms !== "true") {
      newErrors.terms = "Please accept the terms";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});

    // SavingData
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: maindata.email,
          password: maindata.password,
          firstName: maindata.name,
          lastName: maindata.lastname,
          terms: maindata.terms
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ❌ Registration failed
        addToast({
          title: "Failed to Sign-up!",
          description: data.error || "Registration Failed",
          variant: "solid",
          color: "danger",
        });
        return; // ⛔ Stop execution here
      }

      // ✅ Registration successful
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Registration successful:", data.token);
      }

      addToast({
        title: `${data.email} Now Registered!`,
        description: `Registered Successfully: ${data.name} ${data.lastname}`,
        variant: "solid",
        color: "primary",
      });

      // Optional redirect
    } catch (error: any) {
      console.error("Registration error:", error.message);
      alert(error.message);
    }
    // SavingData
  };

  return (
    <Form
      className="w-full justify-center items-center space-y-4"
      validationErrors={errors}
      onReset={() => setSubmitted(null)}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-4 max-w-md">
        {/* Name className=""*/}
        <div className="responsive-row">
          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your name";
              }
              return errors.name;
            }}
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Enter your name"
          />

          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Please enter your Last Name";
              }
              return errors.name;
            }}
            label="Last Name"
            labelPlacement="outside"
            name="lastname"
            placeholder="Enter your Last Name"
          />
        </div>

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
            Submit
          </Button>
          <Button type="reset" variant="bordered">
            Reset
          </Button>
        </div>
      </div>

      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}>
        <p style={{ fontSize: 14, color: "gray" }}>Already have an account?</p>
       <div className="responsive-row px-2">
         <Button
          onClick={() => {
            router.push("/login"); // ✅ go to signup page
          }}
          style={{ width: "fit-content", backgroundColor: "black", color: "white" }}
          radius="md"
        >
          Sign In
        </Button>
        <Button variant="bordered"
          onClick={() => {
            router.push("/google"); // ✅ go to signup page
          }}
          radius="md" startContent={<FcGoogle />} style={{ width: "100%" }}>
          Sign up with Google
        </Button>
       </div>
      </div>

    </Form>
  );
}
