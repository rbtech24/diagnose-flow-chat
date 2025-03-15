
import { Sidebar as SidebarProvider } from "@/components/ui/sidebar";
import { TechSidebar } from "./TechSidebar";
import { Outlet } from "react-router-dom";

export function TechLayout() {
  return (
    <SidebarProvider>
      <TechSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
