
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, MessageSquare, HeartPulse, LifeBuoy, Settings, LogOut, FileText, CreditCard, UserCog } from "lucide-react";

export function CompanySidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Company Dashboard
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/company/dashboard") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/company/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={isActive("/company/technicians") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/company/technicians">
                <UserCog className="mr-2 h-4 w-4" />
                Manage Technicians
              </Link>
            </Button>
            <Button
              variant={isActive("/company/subscription") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/company/subscription">
                <CreditCard className="mr-2 h-4 w-4" />
                Subscription
              </Link>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Community
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/company/community") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/company/community">
                <MessageSquare className="mr-2 h-4 w-4" />
                Forums
              </Link>
            </Button>
            <Button
              variant={isActive("/company/feature-requests") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/company/feature-requests">
                <FileText className="mr-2 h-4 w-4" />
                Feature Requests
              </Link>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Support
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/company/support") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/company/support">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Support Tickets
              </Link>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/company/profile") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/company/profile">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
