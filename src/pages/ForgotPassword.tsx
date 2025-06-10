
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <PageHeader showNavigation={true} />
      
      <div className="flex items-center justify-center py-8 lg:py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              We'll help you get back to your account
            </p>
          </div>
          <PasswordResetForm />
        </div>
      </div>
    </div>
  );
}
