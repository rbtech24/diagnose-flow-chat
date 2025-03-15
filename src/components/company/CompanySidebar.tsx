
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
    <Sidebar>
      <SidebarHeader>
        <div className="font-bold text-lg">Company Portal</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company"} 
                  asChild
                >
                  <Link to="/company">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/community"} 
                  asChild
                >
                  <Link to="/company/community">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Community</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/feature-requests"} 
                  asChild
                >
                  <Link to="/company/feature-requests">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <span>Feature Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Company</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/support"} 
                  asChild
                >
                  <Link to="/company/support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/techs"} 
                  asChild
                >
                  <Link to="/company/techs">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Manage Techs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/company-profile"} 
                  asChild
                >
                  <Link to="/company/company-profile">
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Company Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/billing"} 
                  asChild
                >
                  <Link to="/company/billing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing & Plans</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/company/profile"} 
                  asChild
                >
                  <Link to="/company/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
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
