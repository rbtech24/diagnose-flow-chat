
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  MessageSquare,
  FileText,
  Stethoscope,
  History,
  BarChart,
  Book
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

export function TechSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar defaultExpanded={true}>
      <SidebarHeader className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2 px-4">
          <span className="text-lg font-bold">Technician</span>
        </div>
        <SidebarToggle />
      </SidebarHeader>
      
      <SidebarMain>
        <SidebarNav>
          <SidebarNavGroup label="DASHBOARD">
            <SidebarNavItem 
              icon={<Home className="w-5 h-5" />} 
              active={isActive("/tech/dashboard") || isActive("/tech")}
            >
              <Link to="/tech/dashboard" className="w-full h-full flex items-center">Dashboard</Link>
            </SidebarNavItem>
          </SidebarNavGroup>
          
          <SidebarNavGroup label="TOOLS">
            <SidebarNavItem 
              icon={<Stethoscope className="w-5 h-5" />} 
              active={isActive("/tech/diagnostics")}
            >
              <Link to="/tech/diagnostics" className="w-full h-full flex items-center">Diagnostics</Link>
            </SidebarNavItem>

            <SidebarNavItem 
              icon={<History className="w-5 h-5" />} 
              active={isActive("/tech/tools")}
            >
              <Link to="/tech/tools" className="w-full h-full flex items-center">Tech Tools</Link>
            </SidebarNavItem>

            <SidebarNavItem 
              icon={<Book className="w-5 h-5" />} 
              active={isActive("/tech/knowledge")}
            >
              <Link to="/tech/knowledge" className="w-full h-full flex items-center">Knowledge Base</Link>
            </SidebarNavItem>
          </SidebarNavGroup>
          
          <SidebarNavGroup label="COMMUNITY">
            <SidebarNavItem 
              icon={<MessageSquare className="w-5 h-5" />} 
              active={isActive("/tech/community")}
            >
              <Link to="/tech/community" className="w-full h-full flex items-center">Community</Link>
            </SidebarNavItem>
            
            <SidebarNavItem 
              icon={<FileText className="w-5 h-5" />} 
              active={isActive("/tech/feature-requests")}
            >
              <Link to="/tech/feature-requests" className="w-full h-full flex items-center">Feature Requests</Link>
            </SidebarNavItem>
          </SidebarNavGroup>

          <SidebarNavGroup label="SUPPORT">
            <SidebarNavItem 
              icon={<LifeBuoy className="w-5 h-5" />} 
              active={isActive("/tech/support")}
            >
              <Link to="/tech/support" className="w-full h-full flex items-center">Support</Link>
            </SidebarNavItem>
          </SidebarNavGroup>
        </SidebarNav>
      </SidebarMain>
      
      <SidebarFooter>
        <div className="flex w-full items-center justify-between p-4">
          <Link to="/tech/profile" className="flex items-center gap-2 text-sm font-medium">
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
