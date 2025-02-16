
import { useState } from "react";
import FlowEditor from "@/components/FlowEditor";
import NodeConfigPanel from "@/components/NodeConfigPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Index() {
  const [showConfig, setShowConfig] = useState(true);

  return (
    <div className="h-screen flex">
      <main className="flex-1 bg-gray-50">
        <FlowEditor />
      </main>
      
      <div className={`transition-all duration-300 ${showConfig ? 'w-96' : 'w-0'}`}>
        <Card className={`h-full overflow-hidden transition-all duration-300 ${showConfig ? 'opacity-100' : 'opacity-0'}`}>
          {showConfig && <NodeConfigPanel />}
        </Card>
      </div>

      <Button 
        variant="ghost" 
        size="icon"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
        onClick={() => setShowConfig(!showConfig)}
      >
        {showConfig ? <ChevronRight /> : <ChevronLeft />}
      </Button>
    </div>
  );
}
