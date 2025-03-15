
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
            src="/lovable-uploads/5e12430c-6872-485e-b07a-02b835f8e3d4.png" 
            alt="Repair Auto Pilot" 
            className="h-36"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
