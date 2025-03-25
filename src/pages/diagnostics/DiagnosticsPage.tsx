
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Stethoscope, AlertCircle } from "lucide-react";

export default function DiagnosticsPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Diagnostics</h1>
          <p className="text-muted-foreground">View and manage diagnostic workflows</p>
        </div>
        <Button onClick={() => navigate("/workflow-editor")}>
          View Workflow Editor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Diagnostics</CardTitle>
            <CardDescription>
              Latest diagnostic workflows run by your technicians
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p>No recent diagnostics available.</p>
              <p className="text-sm mt-2">When your technicians run diagnostics, they will appear here.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Workflow Performance</CardTitle>
            <CardDescription>
              Analytics on workflow effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p>No workflow performance data available.</p>
              <p className="text-sm mt-2">Once workflows are used, performance metrics will be shown here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
