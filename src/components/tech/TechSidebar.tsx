
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  User, 
  Wrench, 
  MessageCircle, 
  Lightbulb, 
  HelpCircle,
  Book,
  Stethoscope,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TechSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/tech",
      active: currentPath === "/tech" || currentPath === "/tech/dashboard"
    },
    {
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/tech/profile",
      active: currentPath === "/tech/profile"
    },
    {
      title: "Diagnostics",
      icon: <Stethoscope className="h-5 w-5" />,
      href: "/tech/diagnostics",
      active: currentPath === "/tech/diagnostics"
    },
    {
      title: "Service History",
      icon: <History className="h-5 w-5" />,
      href: "/tech/tools",
      active: currentPath === "/tech/tools"
    },
    {
      title: "Knowledge Base",
      icon: <Book className="h-5 w-5" />,
      href: "/tech/knowledge",
      active: currentPath === "/tech/knowledge"
    },
    {
      title: "Community",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/tech/community",
      active: currentPath.startsWith("/tech/community")
    },
    {
      title: "Feature Requests",
      icon: <Lightbulb className="h-5 w-5" />,
      href: "/tech/feature-requests",
      active: currentPath.startsWith("/tech/feature-requests")
    },
    {
      title: "Support",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/tech/support",
      active: currentPath.startsWith("/tech/support")
    }
  ];

  return (
    <div className="h-screen flex flex-col border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Technician Portal</h2>
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
          <Link to="/tech/profile" className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}
