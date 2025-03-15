
import { Link, useLocation } from "react-router-dom";
import {
  Home, Users, MessageSquare, FileText, LifeBuoy, Settings, LogOut, CreditCard, UserCog
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
              className="cursor-pointer"
            >
              <Link to="/company/dashboard">Dashboard</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<UserCog />} 
              active={isActive("/company/technicians")}
              className="cursor-pointer"
            >
              <Link to="/company/technicians">Manage Technicians</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<CreditCard />} 
              active={isActive("/company/subscription")}
              className="cursor-pointer"
            >
              <Link to="/company/subscription">Subscription</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="Community">
            <SidebarNavItem 
              icon={<MessageSquare />} 
              active={isActive("/company/community")}
              className="cursor-pointer"
            >
              <Link to="/company/community">Forums</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<FileText />} 
              active={isActive("/company/feature-requests")}
              className="cursor-pointer"
            >
              <Link to="/company/feature-requests">Feature Requests</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="Support">
            <SidebarNavItem 
              icon={<LifeBuoy />} 
              active={isActive("/company/support")}
              className="cursor-pointer"
            >
              <Link to="/company/support">Support Tickets</Link>
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
          <button className="flex items-center text-sm gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
