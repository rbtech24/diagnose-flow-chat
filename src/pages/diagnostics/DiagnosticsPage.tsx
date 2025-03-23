
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiagnosticSelector } from "@/components/diagnostics/DiagnosticSelector";
import { DiagnosticSteps } from "@/components/diagnostics/DiagnosticSteps";
import { SavedWorkflow } from "@/utils/flow/types";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { ArrowLeft, Search } from "lucide-react";

export default function DiagnosticsPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<SavedWorkflow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const { isOnline } = useOfflineStatus();
  
  const handleDiagnosticSelect = (workflow: SavedWorkflow) => {
    setSelectedDiagnostic(workflow);
  };

  const handleBack = () => {
    if (selectedDiagnostic) {
      setSelectedDiagnostic(null);
    } else if (selectedCategory) {
      setSelectedCategory("");
    }
  };

  // Mock data for demonstration
  const mockDiagnostics: SavedWorkflow[] = [
    {
      id: "diag-1",
      name: "Refrigerator Cooling Diagnostic",
      categoryId: "cat-1",
      metadata: {
        complexity: "medium",
        applianceType: "refrigerator",
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      nodes: [],
      edges: [],
      nodeCounter: 0
    },
    {
      id: "diag-2",
      name: "Dishwasher Not Draining",
      categoryId: "cat-2",
      metadata: {
        complexity: "high",
        applianceType: "dishwasher",
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      nodes: [],
      edges: [],
      nodeCounter: 0
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {(selectedCategory || selectedDiagnostic) && (
            <Button variant="ghost" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-bold">Diagnostics</h1>
        </div>
        
        {/* Display a syncing status indicator */}
        <div className="text-sm px-2 py-1 rounded-full border">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      {!selectedDiagnostic && (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search diagnostics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DiagnosticSelector 
                  diagnostics={mockDiagnostics} 
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onSelectDiagnostic={handleDiagnosticSelect}
                  searchQuery={searchQuery}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Recent diagnostics would go here */}
                <Card>
                  <CardHeader>
                    <CardTitle>No Recent Diagnostics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>You haven't run any diagnostics recently.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="favorites">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Favorite diagnostics would go here */}
                <Card>
                  <CardHeader>
                    <CardTitle>No Favorite Diagnostics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>You haven't added any diagnostics to your favorites.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {selectedDiagnostic && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedDiagnostic.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Complexity: {selectedDiagnostic.metadata.complexity}</p>
            <p>Appliance Type: {selectedDiagnostic.metadata.applianceType}</p>
            <p>Running diagnostic workflow...</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBack} variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button>Start Diagnosis</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
