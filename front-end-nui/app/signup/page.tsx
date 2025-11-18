"use client";
import { Card } from "@heroui/card";
import { SignupTextData } from "@/apptexts/TextAndLanguage";
import UpdateSignUp from "./update";

export default function SignUPage() {
  const signTxt = SignupTextData;
  return(<>
    {}
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
       <UpdateSignUp />
      </Card>
  </>)
}
 