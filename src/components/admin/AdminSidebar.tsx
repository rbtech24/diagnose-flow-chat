
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Building2, 
  MessageCircle, 
  Lightbulb, 
  HelpCircle, 
  Settings,
  AlertTriangle,
  Key,
  Workflow,
  PlugZap,
  DatabaseZap,
  Book,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin",
      active: currentPath === "/admin" || currentPath === "/admin/dashboard"
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
      active: currentPath.startsWith("/admin/users")
    },
    {
      title: "Companies",
      icon: <Building2 className="h-5 w-5" />,
      href: "/admin/companies",
      active: currentPath.startsWith("/admin/companies")
    },
    {
      title: "Licenses",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/admin/licenses",
      active: currentPath === "/admin/licenses"
    },
    {
      title: "Subscription Plans",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/admin/subscription-plans",
      active: currentPath === "/admin/subscription-plans"
    },
    {
      title: "Knowledge Base",
      icon: <Book className="h-5 w-5" />,
      href: "/admin/knowledge",
      active: currentPath === "/admin/knowledge"
    },
    {
      title: "Knowledge Documents",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/knowledge-documents",
      active: currentPath === "/admin/knowledge-documents"
    },
    {
      title: "Workflows",
      icon: <Workflow className="h-5 w-5" />,
      href: "/admin/workflows",
      active: currentPath === "/admin/workflows"
    },
    {
      title: "Community",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/admin/community",
      active: currentPath.startsWith("/admin/community")
    },
    {
      title: "Feature Requests",
      icon: <Lightbulb className="h-5 w-5" />,
      href: "/admin/feature-requests",
      active: currentPath.startsWith("/admin/feature-requests")
    },
    {
      title: "Support",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/admin/support",
      active: currentPath.startsWith("/admin/support")
    },
    {
      title: "System Messages",
      icon: <AlertTriangle className="h-5 w-5" />,
      href: "/admin/system-messages",
      active: currentPath === "/admin/system-messages"
    },
    {
      title: "API Keys",
      icon: <Key className="h-5 w-5" />,
      href: "/admin/api-keys",
      active: currentPath === "/admin/api-keys"
    },
    {
      title: "API Integrations",
      icon: <PlugZap className="h-5 w-5" />,
      href: "/admin/api-integrations",
      active: currentPath === "/admin/api-integrations"
    },
    {
      title: "CRM Integration",
      icon: <DatabaseZap className="h-5 w-5" />,
      href: "/admin/crm-integration",
      active: currentPath === "/admin/crm-integration"
    },
    {
      title: "Data Sync",
      icon: <DatabaseZap className="h-5 w-5" />,
      href: "/admin/data-sync",
      active: currentPath === "/admin/data-sync"
    }
  ];

  return (
    <div className="h-screen flex flex-col border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Admin Portal</h2>
      </div>
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link, index) => (
            <Button
              key={index}
              variant={link.active ? "default" : "ghost"}
              className="justify-start"
              asChild
            >
              <Link to={link.href} className="flex items-center gap-2">
                {link.icon}
                {link.title}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/admin/profile" className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Settings
          </Link>
        </Button>
      </div>
    </div>
  );
}
