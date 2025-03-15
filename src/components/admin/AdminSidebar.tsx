
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Users, LifeBuoy, Settings, LogOut, 
  FileText, Package, CreditCard, Network,
  Building2, Workflow
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
  SidebarToggle,
  SidebarNavGroup
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar defaultExpanded={true}>
      <SidebarHeader className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2 px-4">
          <span className="text-lg font-bold">Admin</span>
        </div>
        <SidebarToggle />
      </SidebarHeader>
      
      <SidebarMain>
        <SidebarNav>
          <SidebarNavGroup label="DASHBOARD">
            <SidebarNavItem 
              icon={<Home className="w-5 h-5" />} 
              active={isActive("/admin/dashboard")}
              className="cursor-pointer"
            >
              <Link to="/admin/dashboard">Dashboard</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="MANAGEMENT">
            <SidebarNavItem 
              icon={<Building2 className="w-5 h-5" />} 
              active={isActive("/admin/companies")}
              className="cursor-pointer"
            >
              <Link to="/admin/companies">Companies</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<Users className="w-5 h-5" />} 
              active={isActive("/admin/users")}
              className="cursor-pointer"
            >
              <Link to="/admin/users">Users</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<Workflow className="w-5 h-5" />} 
              active={isActive("/admin/workflows")}
              className="cursor-pointer"
            >
              <Link to="/admin/workflows">Workflows</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="SUBSCRIPTION">
            <SidebarNavItem 
              icon={<Package className="w-5 h-5" />} 
              active={isActive("/admin/subscription-plans")}
              className="cursor-pointer"
            >
              <Link to="/admin/subscription-plans">Subscription Plans</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<CreditCard className="w-5 h-5" />} 
              active={isActive("/admin/licenses")}
              className="cursor-pointer"
            >
              <Link to="/admin/licenses">Licenses</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="SYSTEM">
            <SidebarNavItem 
              icon={<Network className="w-5 h-5" />} 
              active={isActive("/admin/api-integrations")}
              className="cursor-pointer"
            >
              <Link to="/admin/api-integrations">API Integrations</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<FileText className="w-5 h-5" />} 
              active={isActive("/admin/feature-requests")}
              className="cursor-pointer"
            >
              <Link to="/admin/feature-requests">Feature Requests</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="SUPPORT">
            <SidebarNavItem 
              icon={<LifeBuoy className="w-5 h-5" />} 
              active={isActive("/admin/support")}
              className="cursor-pointer"
            >
              <Link to="/admin/support">Support Tickets</Link>
            </SidebarNavItem>
          </SidebarNavGroup>
        </SidebarNav>
      </SidebarMain>
      
      <SidebarFooter className="border-t mt-auto">
        <div className="flex w-full items-center justify-between p-4">
          <Link to="/admin/profile" className="flex items-center gap-2 text-sm font-medium">
            <Settings size={20} className="text-muted-foreground" />
            <span>Settings</span>
          </Link>
          <Link to="/login" className="flex items-center text-sm gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
