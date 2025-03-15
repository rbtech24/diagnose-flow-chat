
import { Link, useLocation } from "react-router-dom";
import {
  Home, MessageSquare, FileText, LifeBuoy, Settings, LogOut, CreditCard, UserCog
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
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-4">
          <span className="text-lg font-semibold">Company</span>
        </div>
        <SidebarToggle />
      </SidebarHeader>
      
      <SidebarMain>
        <SidebarNav>
          <SidebarNavGroup label="Dashboard">
            <SidebarNavItem 
              icon={<Home />} 
              active={isActive("/company/dashboard")}
            >
              <Link to="/company/dashboard" className="w-full h-full flex items-center">Dashboard</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<UserCog />} 
              active={isActive("/company/technicians")}
            >
              <Link to="/company/technicians" className="w-full h-full flex items-center">Manage Technicians</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<CreditCard />} 
              active={isActive("/company/subscription")}
            >
              <Link to="/company/subscription" className="w-full h-full flex items-center">Subscription</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="Community">
            <SidebarNavItem 
              icon={<MessageSquare />} 
              active={isActive("/company/community")}
            >
              <Link to="/company/community" className="w-full h-full flex items-center">Forums</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<FileText />} 
              active={isActive("/company/feature-requests")}
            >
              <Link to="/company/feature-requests" className="w-full h-full flex items-center">Feature Requests</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="Support">
            <SidebarNavItem 
              icon={<LifeBuoy />} 
              active={isActive("/company/support")}
            >
              <Link to="/company/support" className="w-full h-full flex items-center">Support Tickets</Link>
            </SidebarNavItem>
          </SidebarNavGroup>
        </SidebarNav>
      </SidebarMain>
      
      <SidebarFooter className="border-t">
        <div className="flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-muted-foreground" />
            <Link to="/company/profile" className="text-sm font-medium">Settings</Link>
          </div>
          <Link to="/login" className="flex items-center text-sm gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
