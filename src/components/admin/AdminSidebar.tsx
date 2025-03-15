
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Users, LifeBuoy, Settings, LogOut, 
  FileText, Package, CreditCard, Network,
  Building2, Wrench
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
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-4">
          <span className="text-lg font-semibold">Admin</span>
        </div>
        <SidebarToggle />
      </SidebarHeader>
      
      <SidebarMain>
        <SidebarNav>
          <SidebarNavGroup label="Dashboard">
            <SidebarNavItem 
              icon={<Home />} 
              active={isActive("/admin/dashboard")}
              className="cursor-pointer"
            >
              <Link to="/admin/dashboard">Dashboard</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="Management">
            <SidebarNavItem 
              icon={<Building2 />} 
              active={isActive("/admin/companies")}
              className="cursor-pointer"
            >
              <Link to="/admin/companies">Companies</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<Users />} 
              active={isActive("/admin/users")}
              className="cursor-pointer"
            >
              <Link to="/admin/users">Users</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<Wrench />} 
              active={isActive("/admin/workflows")}
              className="cursor-pointer"
            >
              <Link to="/admin/workflows">Workflows</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="Subscription">
            <SidebarNavItem 
              icon={<Package />} 
              active={isActive("/admin/subscription-plans")}
              className="cursor-pointer"
            >
              <Link to="/admin/subscription-plans">Subscription Plans</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<CreditCard />} 
              active={isActive("/admin/licenses")}
              className="cursor-pointer"
            >
              <Link to="/admin/licenses">Licenses</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="System">
            <SidebarNavItem 
              icon={<Network />} 
              active={isActive("/admin/api-integrations")}
              className="cursor-pointer"
            >
              <Link to="/admin/api-integrations">API Integrations</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<FileText />} 
              active={isActive("/admin/feature-requests")}
              className="cursor-pointer"
            >
              <Link to="/admin/feature-requests">Feature Requests</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="Support">
            <SidebarNavItem 
              icon={<LifeBuoy />} 
              active={isActive("/admin/support")}
              className="cursor-pointer"
            >
              <Link to="/admin/support">Support Tickets</Link>
            </SidebarNavItem>
          </SidebarNavGroup>
        </SidebarNav>
      </SidebarMain>
      
      <SidebarFooter className="border-t">
        <div className="flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-muted-foreground" />
            <Link to="/admin/profile" className="text-sm font-medium">Settings</Link>
          </div>
          <button className="flex items-center text-sm gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
