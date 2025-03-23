
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Filter, CheckCircle2, Clock, AlertTriangle, Users, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ServiceRecord {
  id: string;
  date: string;
  clientName: string;
  appliance: string;
  status: "completed" | "ongoing" | "scheduled";
  duration: string;
  issue: string;
  technicianName?: string;
  companyName?: string;
}

export function ServiceHistory() {
  const [filter, setFilter] = useState<"all" | "completed" | "ongoing" | "scheduled">("all");
  const [viewMode, setViewMode] = useState<"personal" | "system">("personal");
  const [selectedAppliance, setSelectedAppliance] = useState<string>("all");
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  
  // This would be replaced with actual data fetching in a real application
  const uniqueAppliances: string[] = [];
  
  // Filter records based on multiple criteria
  const filteredRecords = serviceRecords.filter(record => {
    // Filter by status if not "all"
    const statusMatch = filter === "all" || record.status === filter;
    
    // Filter by appliance if not "all"
    const applianceMatch = selectedAppliance === "all" || record.appliance === selectedAppliance;
    
    // Filter by view mode (personal vs system)
    const viewModeMatch = viewMode === "system" || record.technicianName === "Current User";
    
    return statusMatch && applianceMatch && viewModeMatch;
  });

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
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-500" />
            <CardTitle>Service History</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedAppliance} onValueChange={setSelectedAppliance}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Appliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Appliances</SelectItem>
                {uniqueAppliances.map((appliance) => (
                  <SelectItem key={appliance} value={appliance}>
                    {appliance}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription>
          {viewMode === "personal" 
            ? "Track your service calls and repair history" 
            : "View system-wide repair history across all technicians"}
        </CardDescription>
        
        {/* Improved View Mode Toggle - More Prominent */}
        <div className="mt-4 border rounded-md p-3 bg-slate-50">
          <div className="flex justify-between items-center">
            <span className="font-medium">View Mode:</span>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-md ${viewMode === "personal" ? "bg-blue-100" : ""}`}>
                <User className={`h-5 w-5 ${viewMode === "personal" ? "text-blue-600" : "text-gray-500"}`} />
                <span className={viewMode === "personal" ? "font-medium text-blue-600" : "text-gray-500"}>Personal History</span>
              </div>
              
              <Switch 
                checked={viewMode === "system"}
                onCheckedChange={(checked) => setViewMode(checked ? "system" : "personal")}
                className="data-[state=checked]:bg-blue-600"
              />
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-md ${viewMode === "system" ? "bg-blue-100" : ""}`}>
                <Users className={`h-5 w-5 ${viewMode === "system" ? "text-blue-600" : "text-gray-500"}`} />
                <span className={viewMode === "system" ? "font-medium text-blue-600" : "text-gray-500"}>System-wide History</span>
              </div>
            </div>
          </div>
        </div>
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
            {viewMode === "personal" ? (
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
            ) : (
              // System-wide view with table layout
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Appliance</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map(record => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.appliance}</TableCell>
                          <TableCell>{record.issue}</TableCell>
                          <TableCell>
                            <span className={record.technicianName === "Current User" ? "font-medium text-blue-600" : ""}>
                              {record.technicianName}
                            </span>
                          </TableCell>
                          <TableCell>{record.companyName || "Your Company"}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No service records match the selected filter
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
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
