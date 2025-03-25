
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Table2, DownloadCloud, BarChart2, ChevronDown, Clock, Stethoscope, Users } from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DiagnosticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { workflows, isLoading } = useWorkflows();
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  
  // Mock data for company diagnostic history
  const diagnosticHistory = [
    {
      id: "diag-1",
      workflowName: "Refrigerator Cooling Issue",
      technicianName: "Michael Johnson",
      technicianInitials: "MJ",
      status: "completed",
      date: new Date(2023, 10, 2),
      result: "Resolved"
    },
    {
      id: "diag-2",
      workflowName: "Washer Motor Diagnosis",
      technicianName: "Sarah Thompson",
      technicianInitials: "ST",
      status: "in-progress",
      date: new Date(2023, 10, 5),
      result: "Pending"
    },
    {
      id: "diag-3",
      workflowName: "HVAC Air Flow Analysis",
      technicianName: "David Garcia",
      technicianInitials: "DG",
      status: "completed",
      date: new Date(2023, 10, 1),
      result: "Replacement needed"
    },
    {
      id: "diag-4",
      workflowName: "Dishwasher Leak Diagnosis",
      technicianName: "Michael Johnson",
      technicianInitials: "MJ",
      status: "completed",
      date: new Date(2023, 9, 28),
      result: "Resolved"
    }
  ];

  // Filter diagnostic history based on search query and timeframe
  const filteredHistory = diagnosticHistory.filter(diag => {
    // Filter by search
    const matchesSearch = 
      diag.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diag.technicianName.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by timeframe
    if (timeframeFilter === "all") return matchesSearch;
    if (timeframeFilter === "today") {
      const today = new Date();
      return matchesSearch && 
        diag.date.getDate() === today.getDate() &&
        diag.date.getMonth() === today.getMonth() &&
        diag.date.getFullYear() === today.getFullYear();
    }
    if (timeframeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && diag.date >= weekAgo;
    }
    if (timeframeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return matchesSearch && diag.date >= monthAgo;
    }
    return matchesSearch;
  });

  // Get technicians from diagnostic history (unique)
  const technicians = [...new Map(
    diagnosticHistory.map(diag => 
      [diag.technicianName, { name: diag.technicianName, initials: diag.technicianInitials }]
    )
  ).values()];

  // Count diagnostics by status
  const diagnosticStats = {
    completed: diagnosticHistory.filter(d => d.status === "completed").length,
    inProgress: diagnosticHistory.filter(d => d.status === "in-progress").length,
    total: diagnosticHistory.length,
    technicians: new Set(diagnosticHistory.map(d => d.technicianName)).size
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Company Diagnostics</h1>
          <p className="text-muted-foreground">Overview of all diagnostic activities by your technicians</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search diagnostics..." 
            className="pl-9 w-full sm:w-[300px]" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{diagnosticStats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">{diagnosticStats.completed}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-2xl font-bold">{diagnosticStats.inProgress}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-2xl font-bold">{diagnosticStats.technicians}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="diagnostics" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="diagnostics">Diagnostic History</TabsTrigger>
          <TabsTrigger value="technicians">Technician Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diagnostics" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Diagnostic History</CardTitle>
                  <CardDescription>
                    View all diagnostic sessions by your technicians
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Timeframe:</span>
                  <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table2 className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Workflow</th>
                      <th className="py-3 px-4 text-left font-medium">Technician</th>
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-left font-medium">Result</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                          No diagnostics found matching your filters
                        </td>
                      </tr>
                    ) : (
                      filteredHistory.map((diag) => (
                        <tr key={diag.id} className="border-b">
                          <td className="py-3 px-4">{diag.workflowName}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {diag.technicianInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span>{diag.technicianName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{diag.date.toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant={diag.status === "completed" ? "outline" : "secondary"}>
                              {diag.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{diag.result}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/company/diagnostics/${diag.id}`}>View</a>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table2>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technicians" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technician Performance</CardTitle>
              <CardDescription>
                Track how your technicians are performing with diagnostics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {technicians.map((tech) => (
                  <div key={tech.name} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{tech.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{tech.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {diagnosticHistory.filter(d => d.technicianName === tech.name).length} diagnostics
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/company/technicians/${tech.name.toLowerCase().replace(' ', '-')}`}>
                          View Profile
                        </a>
                      </Button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Total Diagnostics</div>
                        <div className="text-lg font-semibold">
                          {diagnosticHistory.filter(d => d.technicianName === tech.name).length}
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Completed</div>
                        <div className="text-lg font-semibold text-green-600">
                          {diagnosticHistory.filter(d => 
                            d.technicianName === tech.name && d.status === "completed"
                          ).length}
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">In Progress</div>
                        <div className="text-lg font-semibold text-amber-600">
                          {diagnosticHistory.filter(d => 
                            d.technicianName === tech.name && d.status === "in-progress"
                          ).length}
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Resolution Rate</div>
                        <div className="text-lg font-semibold">
                          {(() => {
                            const completed = diagnosticHistory.filter(d => 
                              d.technicianName === tech.name && d.status === "completed"
                            ).length;
                            const total = diagnosticHistory.filter(d => 
                              d.technicianName === tech.name
                            ).length;
                            return total ? `${Math.round((completed / total) * 100)}%` : "0%";
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Reports</CardTitle>
              <CardDescription>
                Generate and download reports for your diagnostics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Diagnostic Summary</CardTitle>
                      <CardDescription>Summary of all diagnostic activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Generate a report summarizing all diagnostic activities, 
                          including success rates, common issues, and technician performance.
                        </p>
                        <Button className="w-full">
                          <DownloadCloud className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Technician Performance</CardTitle>
                      <CardDescription>Compare technician efficiency and metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Generate a detailed report on technician performance,
                          including efficiency metrics, diagnostic accuracy, and issue resolution.
                        </p>
                        <Button className="w-full">
                          <DownloadCloud className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Custom Report</CardTitle>
                    <CardDescription>Generate a custom diagnostic report</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Report Type</label>
                          <Select defaultValue="summary">
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="summary">Diagnostic Summary</SelectItem>
                              <SelectItem value="technician">Technician Performance</SelectItem>
                              <SelectItem value="issue">Issue Analysis</SelectItem>
                              <SelectItem value="trend">Trend Analysis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Time Range</label>
                          <Select defaultValue="month">
                            <SelectTrigger>
                              <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="week">Last Week</SelectItem>
                              <SelectItem value="month">Last Month</SelectItem>
                              <SelectItem value="quarter">Last Quarter</SelectItem>
                              <SelectItem value="year">Last Year</SelectItem>
                              <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Format</label>
                        <Select defaultValue="pdf">
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                            <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button className="w-full">
                        <DownloadCloud className="h-4 w-4 mr-2" />
                        Generate Custom Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
