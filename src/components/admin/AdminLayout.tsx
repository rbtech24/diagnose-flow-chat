
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AdminLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarProvider>
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
