
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Filter, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface ServiceRecord {
  id: string;
  date: string;
  clientName: string;
  appliance: string;
  status: "completed" | "ongoing" | "scheduled";
  duration: string;
  issue: string;
}

const mockServiceHistory: ServiceRecord[] = [
  {
    id: "srv-001",
    date: "2023-10-15",
    clientName: "Johnson Residence",
    appliance: "Refrigerator XC-5000",
    status: "completed",
    duration: "1h 45m",
    issue: "Compressor failure"
  },
  {
    id: "srv-002",
    date: "2023-10-18",
    clientName: "Smith Apartments",
    appliance: "HVAC System 3000",
    status: "completed",
    duration: "2h 30m",
    issue: "Thermostat malfunction"
  },
  {
    id: "srv-003",
    date: "2023-10-21",
    clientName: "Green Family",
    appliance: "Washing Machine WM-200",
    status: "ongoing",
    duration: "1h (in progress)",
    issue: "Water leak detection"
  },
  {
    id: "srv-004",
    date: "2023-10-24",
    clientName: "Davis Building",
    appliance: "Commercial Freezer F-9000",
    status: "scheduled",
    duration: "Not started",
    issue: "Temperature inconsistency"
  }
];

export function ServiceHistory() {
  const [filter, setFilter] = useState<"all" | "completed" | "ongoing" | "scheduled">("all");
  
  const filteredRecords = filter === "all" 
    ? mockServiceHistory 
    : mockServiceHistory.filter(record => record.status === filter);

  const getStatusBadge = (status: ServiceRecord["status"]) => {
    switch(status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "ongoing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      case "scheduled":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Scheduled</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-500" />
            <CardTitle>Service History</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <CardDescription>Track your service calls and repair history</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>
            <TabsTrigger value="ongoing" onClick={() => setFilter("ongoing")}>In Progress</TabsTrigger>
            <TabsTrigger value="scheduled" onClick={() => setFilter("scheduled")}>Scheduled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(record => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{record.clientName}</h3>
                        <p className="text-sm text-gray-500">{record.appliance}</p>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span>{record.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                        <span>{record.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1 text-sm">
                      <AlertTriangle className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
                      <span>{record.issue}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No service records match the selected filter
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            {/* Content will be shown through the filter functionality */}
          </TabsContent>
          <TabsContent value="ongoing" className="mt-0">
            {/* Content will be shown through the filter functionality */}
          </TabsContent>
          <TabsContent value="scheduled" className="mt-0">
            {/* Content will be shown through the filter functionality */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
