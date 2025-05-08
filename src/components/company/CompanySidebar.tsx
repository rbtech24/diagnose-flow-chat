
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Calendar,
  ClipboardList,
  LineChart,
  MessageCircle,
  LifeBuoy,
  BadgeDollarSign,
  FileText,
  Building2
} from "lucide-react";

export function CompanySidebar() {
  const location = useLocation();
  
  const links = [
    {
      href: "/company",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true,
    },
    {
      href: "/company/technicians",
      label: "Technicians",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/company/schedules",
      label: "Schedules",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      href: "/company/repairs",
      label: "Repairs",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      href: "/company/customers",
      label: "Customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/company/reports",
      label: "Reports",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      href: "/company/documents",
      label: "Documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/company/community",
      label: "Community",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      href: "/company/support",
      label: "Support",
      icon: <LifeBuoy className="h-5 w-5" />,
    },
    {
      href: "/company/subscription",
      label: "Subscription",
      icon: <BadgeDollarSign className="h-5 w-5" />,
    },
    {
      href: "/company/profile",
      label: "Company Profile",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      href: "/company/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    }
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-4">
        <h1 className="text-xl font-bold">Company Dashboard</h1>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {links.map((link, index) => {
            const isActive = link.exact 
              ? location.pathname === link.href
              : location.pathname.startsWith(link.href);
            
            return (
              <NavLink
                key={index}
                to={link.href}
                end={link.exact}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground",
                  "transition-all hover:bg-accent",
                  isActive ? "bg-accent text-foreground font-medium" : ""
                )}
              >
                {link.icon}
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
