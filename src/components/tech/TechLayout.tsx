
import { TechSidebar } from "./TechSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserMessages } from "@/context/SystemMessageContext";
import { SystemMessage } from "@/components/system/SystemMessage";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useUserManagementStore } from "@/store/userManagementStore";

export function TechLayout() {
  const navigate = useNavigate();
  const userMessages = useUserMessages("tech");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentUser, fetchUsers } = useUserManagementStore();

  // Fetch users on component mount if we don't have a current user
  useEffect(() => {
    if (!currentUser) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  return (
    <div className="flex h-screen w-full">
      {isMobile ? (
        <>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <TechSidebar collapsed={false} />
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <TechSidebar collapsed={sidebarCollapsed} />
      )}
      
      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 border-b flex items-center justify-between">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          <div className="relative w-full max-w-[180px] sm:max-w-[250px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 py-1 h-9 text-sm" />
          </div>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full"
            onClick={() => navigate("/tech/profile")}
          >
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <img className="aspect-square h-full w-full" src={currentUser?.avatarUrl || "https://i.pravatar.cc/300"} alt="Profile" />
            </span>
          </Button>
        </div>
        
        <div className="p-3 sm:p-6">
          {userMessages.map(msg => (
            <SystemMessage
              key={msg.id}
              type={msg.type}
              title={msg.title}
              message={msg.message}
            />
          ))}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
