
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceHistory } from "@/components/tech/ServiceHistory";
import { PerformanceMetrics } from "@/components/tech/PerformanceMetrics";
import { KnowledgeBase } from "@/components/tech/KnowledgeBase";

export default function TechTools() {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Technician Tools</h1>
      </div>

      <Tabs 
        defaultValue="history" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Service History</TabsTrigger>
          <TabsTrigger value="metrics">Performance</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-6">
          <ServiceHistory />
        </TabsContent>
        <TabsContent value="metrics" className="mt-6">
          <PerformanceMetrics />
        </TabsContent>
        <TabsContent value="knowledge" className="mt-6">
          <div className="h-[500px]">
            <KnowledgeBase />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
