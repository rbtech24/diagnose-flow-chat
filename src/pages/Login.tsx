
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();

  // Automatically redirect to home page
  useEffect(() => {
    console.log("Login page bypassed, redirecting to home");
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-6">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Redirecting...</CardTitle>
          <CardDescription>
            Authentication has been disabled. You are being redirected to the home page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>If you are not redirected automatically, click <a href="/" className="text-blue-600 hover:underline">here</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
