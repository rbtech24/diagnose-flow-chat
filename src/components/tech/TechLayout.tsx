
import { Outlet } from "react-router-dom";
import { TechSidebar } from "./TechSidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserMessages, useSystemMessages } from "@/context/SystemMessageContext";
import { SystemMessage } from "@/components/system/SystemMessage";
import { OfflineIndicator } from "@/components/system/OfflineIndicator";
import { Search, Menu, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";

export function TechLayout() {
  const navigate = useNavigate();
  const userMessages = useUserMessages("tech");
  const { removeMessage } = useSystemMessages();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="flex h-screen w-full">
      {isMobile ? (
        <>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <TechSidebar />
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <TechSidebar />
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
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full"
              onClick={() => navigate("/tech/profile")}
            >
              <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <img 
                  className="aspect-square h-full w-full" 
                  src={user?.avatarUrl || "https://i.pravatar.cc/300"} 
                  alt={user?.name || "Profile"} 
                />
              </span>
            </Button>
          </div>
        </div>
        
        <div className="p-3 sm:p-6">
          {userMessages.map(msg => (
            <SystemMessage
              key={msg.id}
              id={msg.id}
              type={msg.type}
              title={msg.title}
              message={msg.message}
              dismissible={msg.dismissible}
              onDismiss={() => removeMessage(msg.id)}
            />
          ))}
          <Outlet />
          <OfflineIndicator />
        </div>
      </div>
    </div>
  );
}
