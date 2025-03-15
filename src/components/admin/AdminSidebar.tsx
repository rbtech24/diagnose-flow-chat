
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, Users, LifeBuoy, Settings, LogOut, 
  FileText, Package, CreditCard, Network
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Admin Dashboard
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/admin/dashboard") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Subscription Management
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/admin/subscription-plans") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/subscription-plans">
                <Package className="mr-2 h-4 w-4" />
                Subscription Plans
              </Link>
            </Button>
            <Button
              variant={isActive("/admin/licenses") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/licenses">
                <CreditCard className="mr-2 h-4 w-4" />
                Licenses
              </Link>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            System
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/admin/api-integrations") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/api-integrations">
                <Network className="mr-2 h-4 w-4" />
                API Integrations
              </Link>
            </Button>
            <Button
              variant={isActive("/admin/feature-requests") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/feature-requests">
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
              variant={isActive("/admin/support") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/support">
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
              variant={isActive("/admin/profile") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/profile">
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
