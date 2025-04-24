
import React from "react";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout 
      title="Forgot password"
      description="Enter your email address and we'll send you a link to reset your password"
      showSalesContent={false}
    >
      <PasswordResetForm />
    </AuthLayout>
  );
}
