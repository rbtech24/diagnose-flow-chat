
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  CreditCard,
  MessageSquare,
  FileText,
  Stethoscope,
  Library
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
import { useUserManagementStore } from "@/store/userManagementStore";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export function CompanySidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserManagementStore();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
      navigate("/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

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
              icon={<Library className="w-5 h-5" />} 
              active={isActive("/company/file-library")}
            >
              <Link to="/company/file-library" className="w-full h-full flex items-center">File Library</Link>
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
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center text-sm gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={18} />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
