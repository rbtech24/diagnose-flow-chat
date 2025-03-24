
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { Stethoscope, Book, MessageCircle, Wrench } from "lucide-react";

export default function TechDashboard() {
  const { role, isLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  
  // Check if user is authorized to access this page
  if (!isLoading && role !== 'tech' && role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tech Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Diagnostics
            </CardTitle>
            <CardDescription>Run diagnostic procedures</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Access diagnostic tools to troubleshoot and fix appliance issues.</p>
            <Button className="w-full" asChild>
              <Link to="/tech/diagnostics">Start Diagnosis</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-green-600" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Access repair guides</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Browse technical documentation, manuals, and repair guides.</p>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/tech/knowledge">View Knowledge Base</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              Community
            </CardTitle>
            <CardDescription>Connect with other technicians</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Ask questions, share knowledge, and communicate with peers.</p>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/tech/community">Join Discussion</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
