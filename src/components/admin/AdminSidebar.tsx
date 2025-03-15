
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
  LayoutDashboard, Users, Building2, Workflow, Settings, LogOut,
  History, Lightbulb, HelpCircle, Shield, Key, FileText, UserCircle
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="bg-slate-900 text-white border-r border-slate-800">
      <SidebarHeader className="border-b border-slate-800">
        <div className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Admin Portal</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin"} 
                  className={location.pathname === "/admin" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/workflows"} 
                  className={location.pathname === "/workflows" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/workflows">
                    <Workflow className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Workflows</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/repair-history"} 
                  className={location.pathname === "/admin/repair-history" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/repair-history">
                    <History className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Repair History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/community"} 
                  className={location.pathname === "/admin/community" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/community">
                    <Users className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Community</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/feature-requests"} 
                  className={location.pathname === "/admin/feature-requests" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/feature-requests">
                    <Lightbulb className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Feature Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/support"} 
                  className={location.pathname === "/admin/support" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/support">
                    <HelpCircle className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/companies"} 
                  className={location.pathname === "/admin/companies" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/companies">
                    <Building2 className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Companies</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/users"} 
                  className={location.pathname === "/admin/users" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/users">
                    <Users className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/plans"} 
                  className={location.pathname === "/admin/plans" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/plans">
                    <FileText className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Plans</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/security"} 
                  className={location.pathname === "/admin/security" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/security">
                    <Shield className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Security</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/api-settings"} 
                  className={location.pathname === "/admin/api-settings" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/api-settings">
                    <Key className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>API Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/licenses"} 
                  className={location.pathname === "/admin/licenses" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/licenses">
                    <FileText className="mr-2 h-4 w-4 text-indigo-400" />
                    <span>Licenses</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  active={location.pathname === "/admin/profile"} 
                  className={location.pathname === "/admin/profile" ? "bg-indigo-800 text-white" : "hover:bg-slate-800"}
                  asChild
                >
                  <Link to="/admin/profile">
                    <UserCircle className="mr-2 h-4 w-4 text-indigo-400" />
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
