
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  CreditCard,
  MessageSquare,
  FileText,
  Stethoscope
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

export function CompanySidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar defaultExpanded={true}>
      <SidebarHeader className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2 px-4">
          <span className="text-lg font-bold">Company</span>
        </div>
        <SidebarToggle />
      </SidebarHeader>
      
      <SidebarMain>
        <SidebarNav>
          <SidebarNavGroup label="DASHBOARD">
            <SidebarNavItem 
              icon={<Home className="w-5 h-5" />} 
              active={isActive("/company/dashboard") || isActive("/company")}
            >
              <Link to="/company/dashboard" className="w-full h-full flex items-center">Dashboard</Link>
            </SidebarNavItem>
          </SidebarNavGroup>
          
          <SidebarNavGroup label="RESOURCES">
            <SidebarNavItem 
              icon={<Stethoscope className="w-5 h-5" />} 
              active={isActive("/company/diagnostics")}
            >
              <Link to="/company/diagnostics" className="w-full h-full flex items-center">Diagnostics</Link>
            </SidebarNavItem>

            <SidebarNavItem 
              icon={<MessageSquare className="w-5 h-5" />} 
              active={isActive("/company/community")}
            >
              <Link to="/company/community" className="w-full h-full flex items-center">Community</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<FileText className="w-5 h-5" />} 
              active={isActive("/company/feature-requests")}
            >
              <Link to="/company/feature-requests" className="w-full h-full flex items-center">Feature Requests</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="MANAGEMENT">
            <SidebarNavItem 
              icon={<Users className="w-5 h-5" />} 
              active={isActive("/company/technicians")}
            >
              <Link to="/company/technicians" className="w-full h-full flex items-center">Technicians</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<CreditCard className="w-5 h-5" />} 
              active={isActive("/company/subscription")}
            >
              <Link to="/company/subscription" className="w-full h-full flex items-center">Subscription</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="SUPPORT">
            <SidebarNavItem 
              icon={<LifeBuoy className="w-5 h-5" />} 
              active={isActive("/company/support")}
            >
              <Link to="/company/support" className="w-full h-full flex items-center">Support</Link>
            </SidebarNavItem>
          </SidebarNavGroup>
        </SidebarNav>
      </SidebarMain>
      
      <SidebarFooter>
        <div className="flex w-full items-center justify-between p-4">
          <Link to="/company/profile" className="flex items-center gap-2 text-sm font-medium">
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
