
import { Sidebar } from "@/components/ui/sidebar";
import { TechSidebar } from "./TechSidebar";
import { Outlet } from "react-router-dom";

export function TechLayout() {
  return (
    <div className="flex h-screen w-full">
      <TechSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 border-b flex items-center h-16 justify-start">
          {/* Logo has been removed */}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
