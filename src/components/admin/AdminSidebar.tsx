
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Users, LifeBuoy, Settings, LogOut, 
  FileText, Package, CreditCard, Network,
  Building2, Workflow, MessageSquare
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
            >
              <Link to="/admin/dashboard" className="w-full h-full flex items-center">Dashboard</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="MANAGEMENT">
            <SidebarNavItem 
              icon={<Building2 className="w-5 h-5" />} 
              active={isActive("/admin/companies")}
            >
              <Link to="/admin/companies" className="w-full h-full flex items-center">Companies</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<Users className="w-5 h-5" />} 
              active={isActive("/admin/users")}
            >
              <Link to="/admin/users" className="w-full h-full flex items-center">Users</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<Workflow className="w-5 h-5" />} 
              active={isActive("/admin/workflows")}
            >
              <Link to="/admin/workflows" className="w-full h-full flex items-center">Workflows</Link>
            </SidebarNavItem>

            <SidebarNavItem 
              icon={<MessageSquare className="w-5 h-5" />} 
              active={isActive("/admin/community")}
            >
              <Link to="/admin/community" className="w-full h-full flex items-center">Community</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="SUBSCRIPTION">
            <SidebarNavItem 
              icon={<Package className="w-5 h-5" />} 
              active={isActive("/admin/subscription-plans")}
            >
              <Link to="/admin/subscription-plans" className="w-full h-full flex items-center">Subscription Plans</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<CreditCard className="w-5 h-5" />} 
              active={isActive("/admin/licenses")}
            >
              <Link to="/admin/licenses" className="w-full h-full flex items-center">Licenses</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="SYSTEM">
            <SidebarNavItem 
              icon={<Network className="w-5 h-5" />} 
              active={isActive("/admin/api-integrations")}
            >
              <Link to="/admin/api-integrations" className="w-full h-full flex items-center">API Integrations</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<FileText className="w-5 h-5" />} 
              active={isActive("/admin/feature-requests")}
            >
              <Link to="/admin/feature-requests" className="w-full h-full flex items-center">Feature Requests</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="SUPPORT">
            <SidebarNavItem 
              icon={<LifeBuoy className="w-5 h-5" />} 
              active={isActive("/admin/support")}
            >
              <Link to="/admin/support" className="w-full h-full flex items-center">Support Tickets</Link>
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
