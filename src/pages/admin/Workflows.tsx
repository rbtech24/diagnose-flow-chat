
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlowChart, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminWorkflows() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage diagnosis workflows across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search workflows..." className="pl-8 w-[250px]" />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Workflows</CardTitle>
            <CardDescription>Diagnosis workflows available in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample workflows - would be populated from API in a real app */}
              {[
                { name: "Refrigerator Not Cooling", appliance: "Refrigerator", status: "published" },
                { name: "Dishwasher Leaking Water", appliance: "Dishwasher", status: "draft" },
                { name: "Oven Not Heating", appliance: "Oven", status: "published" },
              ].map((workflow, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <FlowChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{workflow.name}</h3>
                      <p className="text-sm text-muted-foreground">{workflow.appliance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={workflow.status === "published" ? "success" : "secondary"}>
                      {workflow.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit Workflow
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
