
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
            src="public/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
            alt="Repair Auto Pilot" 
            className="h-8"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
