
import { Link, useLocation } from "react-router-dom";
import { GitPullRequest, Users, Building2, FileText, BarChart3, HeadphonesIcon, Settings, MessageSquare, Lightbulb, PiggyBank, Database, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 border-r border-gray-200 h-screen bg-white overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Link to="/admin">
            <h2 className="text-xl font-bold">HVAC Admin</h2>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard">
            <Button
              variant={isActive("/admin/dashboard") || isActive("/admin") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/dashboard") || isActive("/admin") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/admin/support">
            <Button
              variant={isActive("/admin/support") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/support") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <HeadphonesIcon className="mr-2 h-4 w-4" />
              Support
            </Button>
          </Link>
          <Link to="/admin/community">
            <Button
              variant={isActive("/admin/community") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/community") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Community
            </Button>
          </Link>
          <Link to="/admin/feature-requests">
            <Button
              variant={isActive("/admin/feature-requests") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/feature-requests") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Feature Requests
            </Button>
          </Link>
          
          <div className="pt-2 pb-2">
            <div className="border-t border-gray-200"></div>
          </div>

          <Link to="/admin/users">
            <Button
              variant={isActive("/admin/users") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/users") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
          </Link>
          <Link to="/admin/companies">
            <Button
              variant={isActive("/admin/companies") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/companies") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Companies
            </Button>
          </Link>
          <Link to="/admin/workflows">
            <Button
              variant={isActive("/admin/workflows") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/workflows") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-purple-50 hover:text-purple-700")}
            >
              <Workflow className="mr-2 h-4 w-4" />
              Workflows
            </Button>
          </Link>
          
          <div className="pt-2 pb-2">
            <div className="border-t border-gray-200"></div>
          </div>

          <Link to="/admin/subscription-plans">
            <Button
              variant={isActive("/admin/subscription-plans") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/subscription-plans") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <PiggyBank className="mr-2 h-4 w-4" />
              Subscription Plans
            </Button>
          </Link>
          <Link to="/admin/licenses">
            <Button
              variant={isActive("/admin/licenses") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/licenses") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Licenses
            </Button>
          </Link>
          <Link to="/admin/api-integrations">
            <Button
              variant={isActive("/admin/api-integrations") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/api-integrations") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <Database className="mr-2 h-4 w-4" />
              API Integrations
            </Button>
          </Link>
          <Link to="/admin/profile">
            <Button
              variant={isActive("/admin/profile") ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive("/admin/profile") ? "bg-gray-100 text-gray-900" : "text-gray-600")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
