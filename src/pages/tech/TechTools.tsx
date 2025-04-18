
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { ServiceHistory } from "@/components/tech/ServiceHistory";

export default function TechTools() {
  const { role, isLoading } = useUserRole();
  
  // Check if user is authorized to access this page
  if (!isLoading && role !== 'tech' && role !== 'admin' && role !== 'company') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Service History</h1>
      </div>

      <ServiceHistory />
    </div>
  );
}
