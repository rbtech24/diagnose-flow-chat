
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Stethoscope, Play, Clock, BarChart, Download } from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";

export default function TechDiagnostics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { workflows, isLoading } = useWorkflows();
  
  // Filter workflows based on search and tab
  const filteredWorkflows = workflows.filter(workflow => {
    // Filter by search query
    const matchesSearch = 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "appliances") return matchesSearch && workflow.category === "appliance";
    if (activeTab === "electronics") return matchesSearch && workflow.category === "electronics";
    if (activeTab === "hvac") return matchesSearch && workflow.category === "hvac";
    return matchesSearch;
  });
  
  // Sort workflows by most recently used
  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    if (!a.lastUsed && !b.lastUsed) return 0;
    if (!a.lastUsed) return 1;
    if (!b.lastUsed) return -1;
    return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Diagnostics</h1>
          <p className="text-muted-foreground">Run diagnostics workflows to troubleshoot issues</p>
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
      
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Diagnostics</TabsTrigger>
          <TabsTrigger value="appliances">Appliances</TabsTrigger>
          <TabsTrigger value="electronics">Electronics</TabsTrigger>
          <TabsTrigger value="hvac">HVAC</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedWorkflows.length === 0 ? (
            <div className="text-center py-10">
              <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No diagnostics found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "No diagnostics match your search query" 
                  : "There are no diagnostics available for your current role"}
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedWorkflows.map((workflow) => (
                <Card key={workflow.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription>
                      {workflow.category || "General"} • {workflow.complexity || "Beginner"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.description || "No description available"}
                    </p>
                    {workflow.lastUsed && (
                      <div className="flex items-center mt-4 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Last used: {new Date(workflow.lastUsed).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button className="w-full" asChild>
                      <a href={`/tech/run-diagnostic/${workflow.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Run Diagnostic
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="appliances" className="space-y-6">
          {/* Same structure as "all" tab, but filtered for appliances */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWorkflows
              .filter(workflow => workflow.category === "appliance")
              .map((workflow) => (
                <Card key={workflow.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription>
                      {workflow.category || "General"} • {workflow.complexity || "Beginner"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.description || "No description available"}
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button className="w-full" asChild>
                      <a href={`/tech/run-diagnostic/${workflow.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Run Diagnostic
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="electronics" className="space-y-6">
          {/* Electronics tab content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWorkflows
              .filter(workflow => workflow.category === "electronics")
              .map((workflow) => (
                <Card key={workflow.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription>
                      {workflow.category || "General"} • {workflow.complexity || "Beginner"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.description || "No description available"}
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button className="w-full" asChild>
                      <a href={`/tech/run-diagnostic/${workflow.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Run Diagnostic
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="hvac" className="space-y-6">
          {/* HVAC tab content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWorkflows
              .filter(workflow => workflow.category === "hvac")
              .map((workflow) => (
                <Card key={workflow.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription>
                      {workflow.category || "General"} • {workflow.complexity || "Beginner"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.description || "No description available"}
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button className="w-full" asChild>
                      <a href={`/tech/run-diagnostic/${workflow.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Run Diagnostic
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic History</CardTitle>
            <CardDescription>Recently run diagnostic workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-md animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 w-40 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p>No diagnostic history available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Report</CardTitle>
            <CardDescription>Generate reports for your diagnostics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate diagnostic reports for your completed diagnostics.
                You can download reports in PDF or CSV format.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" disabled={isLoading} className="w-full">
                  <BarChart className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" disabled={isLoading} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
