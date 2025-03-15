
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, Wrench, History, Clock, Settings, UserCircle,
  LogOut, HelpCircle, FileText, Lightbulb, Users, MessageSquare
} from "lucide-react";

export function TechSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="bg-slate-900 text-white border-r border-slate-800">
      <SidebarHeader className="border-b border-slate-800">
        <div className="font-bold text-lg bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Technician Portal</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech"} 
                  className={location.pathname === "/tech" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech/repairs"} 
                  className={location.pathname === "/tech/repairs" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/repairs">
                    <Wrench className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Active Repairs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech/history"} 
                  className={location.pathname === "/tech/history" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/history">
                    <History className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Repair History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech/schedule"} 
                  className={location.pathname === "/tech/schedule" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/schedule">
                    <Clock className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Schedule</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname.startsWith("/tech/support")} 
                  className={location.pathname.startsWith("/tech/support") ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/support">
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech/community"} 
                  className={location.pathname === "/tech/community" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/community">
                    <Users className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Community</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech/guides"} 
                  className={location.pathname === "/tech/guides" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/guides">
                    <FileText className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Repair Guides</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech/feature-requests"} 
                  className={location.pathname === "/tech/feature-requests" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/feature-requests">
                    <Lightbulb className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Feature Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech/profile"} 
                  className={location.pathname === "/tech/profile" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/profile">
                    <UserCircle className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/tech/settings"} 
                  className={location.pathname === "/tech/settings" ? "bg-blue-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/tech/settings">
                    <Settings className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-slate-400 hover:bg-slate-800" asChild>
              <Link to="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
