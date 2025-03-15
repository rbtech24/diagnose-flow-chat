
import { SidebarProvider } from "@/components/ui/sidebar";
import { CompanySidebar } from "./CompanySidebar";
import { Outlet } from "react-router-dom";

export function CompanyLayout() {
  return (
    <SidebarProvider>
      <CompanySidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
