
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  MessageCircle, 
  Lightbulb, 
  HelpCircle,
  Book
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CompanySidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/company",
      active: currentPath === "/company" || currentPath === "/company/dashboard"
    },
    {
      title: "Technicians",
      icon: <Users className="h-5 w-5" />,
      href: "/company/technicians",
      active: currentPath === "/company/technicians"
    },
    {
      title: "Knowledge Base",
      icon: <Book className="h-5 w-5" />,
      href: "/company/knowledge",
      active: currentPath === "/company/knowledge"
    },
    {
      title: "Subscription",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/company/subscription",
      active: currentPath.startsWith("/company/subscription")
    },
    {
      title: "Community",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/company/community",
      active: currentPath.startsWith("/company/community")
    },
    {
      title: "Feature Requests",
      icon: <Lightbulb className="h-5 w-5" />,
      href: "/company/feature-requests",
      active: currentPath.startsWith("/company/feature-requests")
    },
    {
      title: "Support",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/company/support",
      active: currentPath.startsWith("/company/support")
    }
  ];

  return (
    <div className="h-screen flex flex-col border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Company Portal</h2>
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
          <Link to="/company/profile" className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Company Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}
