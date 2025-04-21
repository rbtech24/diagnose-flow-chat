
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { CompanyMetrics } from "@/components/company/CompanyMetrics";
import { TechnicianOnboarding } from "@/components/technicians/TechnicianOnboarding";
import { TechnicianList } from "@/components/technicians/TechnicianList";
import { useTechnicianData } from "@/hooks/technicians/useTechnicianData";

export default function CompanyDashboard() {
  const { technicians, handleArchiveTechnician, handleDeleteTechnician } = useTechnicianData();
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <Button asChild>
          <Link to="/company/diagnostics" className="flex items-center">
            <Play className="mr-2 h-4 w-4" />
            Start Diagnosis
          </Link>
        </Button>
      </div>

      <CompanyMetrics />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Manage your technician team</CardDescription>
          </CardHeader>
          <CardContent>
            <TechnicianList
              technicians={technicians}
              onArchive={handleArchiveTechnician}
              onDelete={handleDeleteTechnician}
            />
          </CardContent>
        </Card>

        <TechnicianOnboarding />
      </div>
    </div>
  );
}
