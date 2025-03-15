
import { CompanySidebar } from "./CompanySidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

export function CompanyLayout() {
  return (
    <div className="flex h-screen w-full">
      <SidebarProvider>
        <CompanySidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
