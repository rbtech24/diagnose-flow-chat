
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
            alt="Repair Auto Pilot" 
            className="h-32"
          />
        </div>
        <PasswordResetForm />
      </div>
    </div>
  );
}
