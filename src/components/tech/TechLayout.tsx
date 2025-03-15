
import { Sidebar } from "@/components/ui/sidebar";
import { TechSidebar } from "./TechSidebar";
import { Outlet } from "react-router-dom";

export function TechLayout() {
  return (
    <div className="flex h-screen w-full">
      <TechSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b flex items-center">
          <img 
            src="/lovable-uploads/894f58ab-c3aa-45ba-9ea3-e3a2d9ddf247.png" 
            alt="Repair Auto Pilot" 
            className="h-12"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
