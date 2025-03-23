
import { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";

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
        {/* Dashboard content will go here */}
        <div className="p-6 border rounded-lg text-center">
          <p>Dashboard content will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
