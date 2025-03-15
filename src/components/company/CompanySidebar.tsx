
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
  LayoutDashboard, Users, Lightbulb, HelpCircle, 
  UserCircle, LogOut, CreditCard, Building2 
} from "lucide-react";

export function CompanySidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="bg-slate-900 text-white border-r border-slate-800">
      <SidebarHeader className="border-b border-slate-800">
        <div className="font-bold text-lg bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Company Portal</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company"} 
                  className={location.pathname === "/company" ? "bg-green-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/company">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-green-400" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/community"} 
                  className={location.pathname === "/company/community" ? "bg-green-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/company/community">
                    <Users className="mr-2 h-4 w-4 text-green-400" />
                    <span>Community</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/feature-requests"} 
                  className={location.pathname === "/company/feature-requests" ? "bg-green-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/company/feature-requests">
                    <Lightbulb className="mr-2 h-4 w-4 text-green-400" />
                    <span>Feature Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Company</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/support"} 
                  className={location.pathname === "/company/support" ? "bg-green-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/company/support">
                    <HelpCircle className="mr-2 h-4 w-4 text-green-400" />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/techs"} 
                  className={location.pathname === "/company/techs" ? "bg-green-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/company/techs">
                    <Users className="mr-2 h-4 w-4 text-green-400" />
                    <span>Manage Techs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/company-profile"} 
                  className={location.pathname === "/company/company-profile" ? "bg-green-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/company/company-profile">
                    <Building2 className="mr-2 h-4 w-4 text-green-400" />
                    <span>Company Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/billing"} 
                  className={location.pathname === "/company/billing" ? "bg-green-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/company/billing">
                    <CreditCard className="mr-2 h-4 w-4 text-green-400" />
                    <span>Billing & Plans</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/profile"} 
                  className={location.pathname === "/company/profile" ? "bg-green-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/company/profile">
                    <UserCircle className="mr-2 h-4 w-4 text-green-400" />
                    <span>Profile</span>
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
