
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Users,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  ListChecks,
  MessageSquare,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface TechSidebarProps {
  collapsed?: boolean;
}

export function TechSidebar({ collapsed = false }: TechSidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    setPending(true);
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/dev-login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-secondary",
      collapsed ? "w-[70px]" : "w-60"
    )}>
      <div className="border-b border-muted p-3 flex items-center">
        {collapsed ? (
          <ChevronRight className="h-8 w-8" />
        ) : (
          <>
            <p className="font-semibold">Menu</p>
          </>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <nav className="flex flex-1 flex-col justify-between">
          <div className="space-y-1">
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/tech")} >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/diagnostics")}>
              <Stethoscope className="h-4 w-4 mr-2" />
              Diagnostics
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/tech/feature-requests")}>
              <ListChecks className="h-4 w-4 mr-2" />
              Feature Requests
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/tech/community")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Community
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => navigate("/tech/support")}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Support
            </Button>
          </div>
          <div className="pb-3 space-y-1">
            <Separator className="mb-2" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 pt-1" align="start">
                <div className="px-4 py-2">
                  <div className="font-medium line-clamp-1">{user?.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {user?.email}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/tech/profile")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="ghost" 
              className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
              onClick={handleSignOut} 
              disabled={pending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {pending ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
