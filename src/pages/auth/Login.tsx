
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();

  // Automatically redirect to admin dashboard
  useEffect(() => {
    console.log("Login page bypassed, redirecting to admin dashboard");
    navigate("/admin");
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-6">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Redirecting...</CardTitle>
          <CardDescription>
            Authentication has been disabled. You are being redirected to the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>If you are not redirected automatically, click <a href="/admin" className="text-blue-600 hover:underline">here</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
