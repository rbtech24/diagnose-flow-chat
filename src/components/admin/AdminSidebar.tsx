
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, 
  Users, 
  Settings, 
  Building2, 
  CreditCard, 
  FileText, 
  MessageSquare,
  Lightbulb,
  BellRing,
  Plug,
  Shield,
  Key,
  Clock,
  LogOut,
  Edit,
  Folder
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { path: "/admin/companies", label: "Companies", icon: <Building2 className="h-5 w-5" /> },
    { path: "/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { path: "/admin/admin-accounts", label: "Admin Accounts", icon: <Shield className="h-5 w-5" /> },
    { 
      path: "/admin/workflows", 
      label: "Workflows", 
      icon: <FileText className="h-5 w-5" />,
      hasSubmenu: true,
      submenu: [
        { path: "/admin/workflows", label: "All Workflows", icon: <FileText className="h-4 w-4" /> },
        { path: "/workflow-editor", label: "Workflow Editor", icon: <Edit className="h-4 w-4" /> },
        { path: "/workflows", label: "Workflow Folders", icon: <Folder className="h-4 w-4" /> },
      ] 
    },
    { path: "/admin/subscription-plans", label: "Subscription Plans", icon: <CreditCard className="h-5 w-5" /> },
    { path: "/admin/licenses", label: "Licenses", icon: <CreditCard className="h-5 w-5" /> },
    { path: "/admin/support", label: "Support", icon: <MessageSquare className="h-5 w-5" /> },
    { path: "/admin/feature-requests", label: "Feature Requests", icon: <Lightbulb className="h-5 w-5" /> },
    { path: "/admin/community", label: "Community", icon: <Users className="h-5 w-5" /> },
    { path: "/admin/activity", label: "Activity Log", icon: <Clock className="h-5 w-5" /> },
    { path: "/admin/system-messages", label: "System Messages", icon: <BellRing className="h-5 w-5" /> },
    { path: "/admin/api-integrations", label: "API Integrations", icon: <Plug className="h-5 w-5" /> },
    { path: "/admin/api-keys", label: "API Keys", icon: <Key className="h-5 w-5" /> },
    { path: "/admin/profile", label: "Profile", icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log('Logging out user:', user?.email);
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
      console.log('Logout successful, navigating to login');
      navigate("/login");
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
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" alt="Logo" className="h-8" />
          <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              item.hasSubmenu ? (
                <div key={item.path}>
                  <Menubar className="w-full border-0 p-0 bg-transparent">
                    <MenubarMenu>
                      <MenubarTrigger asChild>
                        <Button
                          variant="sidebar"
                          className={`w-full justify-start ${isActive(item.path) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </Button>
                      </MenubarTrigger>
                      <MenubarContent>
                        {item.submenu?.map((subItem) => (
                          <MenubarItem key={subItem.path} asChild>
                            <Link 
                              to={subItem.path}
                              className="flex items-center cursor-pointer w-full"
                            >
                              {subItem.icon}
                              <span className="ml-2">{subItem.label}</span>
                            </Link>
                          </MenubarItem>
                        ))}
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              ) : (
                <Button
                  key={item.path}
                  variant="sidebar"
                  className={`w-full justify-start ${isActive(item.path) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                  asChild
                >
                  <Link to={item.path} className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </Button>
              )
            ))}
          </nav>
        </div>
      </ScrollArea>
      <div className="h-16 border-t border-sidebar-border p-4">
        <Button 
          variant="sidebar" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </Button>
      </div>
    </div>
  );
}
