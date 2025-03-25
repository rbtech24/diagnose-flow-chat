
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Share2,
  LifeBuoy,
  Lightbulb,
  MessageSquare,
  Building2,
  Key,
  FileText,
  Database,
  Bell,
  Link2,
  Network,
  KeyRound,
  UserCircle,
  UserCog,
} from "lucide-react";

export function AdminSidebar() {
  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true,
    },
    {
      href: "/admin/companies",
      label: "Companies",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/admin/admin-accounts",
      label: "Admin Accounts",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      href: "/admin/workflows",
      label: "Workflows",
      icon: <Share2 className="h-5 w-5" />,
    },
    {
      href: "/admin/subscription-plans",
      label: "Subscription Plans",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/admin/licenses",
      label: "Licenses",
      icon: <Key className="h-5 w-5" />,
    },
    {
      href: "/admin/support",
      label: "Support",
      icon: <LifeBuoy className="h-5 w-5" />,
    },
    {
      href: "/admin/feature-requests",
      label: "Feature Requests",
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      href: "/admin/community",
      label: "Community",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      href: "/admin/knowledge-base",
      label: "Knowledge Base",
      icon: <Database className="h-5 w-5" />,
    },
    {
      href: "/admin/system-messages",
      label: "System Messages",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      href: "/admin/crm-integration",
      label: "CRM Integration",
      icon: <Link2 className="h-5 w-5" />,
    },
    {
      href: "/admin/api-integrations",
      label: "API Integrations",
      icon: <Network className="h-5 w-5" />,
    },
    {
      href: "/admin/api-keys",
      label: "API Keys",
      icon: <KeyRound className="h-5 w-5" />,
    },
    {
      href: "/admin/profile",
      label: "Profile",
      icon: <UserCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.href}
              end={link.exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground",
                  "transition-all hover:bg-accent",
                  isActive ? "bg-accent text-foreground font-medium" : ""
                )
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
