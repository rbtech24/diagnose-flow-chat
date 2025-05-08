
import { Link, useLocation } from "react-router-dom";
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
  Key
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { path: "/admin/companies", label: "Companies", icon: <Building2 className="h-5 w-5" /> },
    { path: "/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { path: "/admin/admin-accounts", label: "Admin Accounts", icon: <Shield className="h-5 w-5" /> },
    { path: "/admin/workflows", label: "Workflows", icon: <FileText className="h-5 w-5" /> },
    { path: "/admin/subscription-plans", label: "Subscription Plans", icon: <CreditCard className="h-5 w-5" /> },
    { path: "/admin/licenses", label: "Licenses", icon: <CreditCard className="h-5 w-5" /> },
    { path: "/admin/support", label: "Support", icon: <MessageSquare className="h-5 w-5" /> },
    { path: "/admin/feature-requests", label: "Feature Requests", icon: <Lightbulb className="h-5 w-5" /> },
    { path: "/admin/community", label: "Community", icon: <Users className="h-5 w-5" /> },
    { path: "/admin/system-messages", label: "System Messages", icon: <BellRing className="h-5 w-5" /> },
    { path: "/admin/api-integrations", label: "API Integrations", icon: <Plug className="h-5 w-5" /> },
    { path: "/admin/api-keys", label: "API Keys", icon: <Key className="h-5 w-5" /> },
    { path: "/admin/profile", label: "Profile", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" alt="Logo" className="h-8" />
          <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
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
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
