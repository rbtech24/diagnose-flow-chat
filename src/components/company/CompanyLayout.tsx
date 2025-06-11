
import { CompanySidebar } from "./CompanySidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserMessages } from "@/context/SystemMessageContext";
import { SystemMessage } from "@/components/system/SystemMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";

export function CompanyLayout() {
  const navigate = useNavigate();
  const userMessages = useUserMessages("company");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getInitials = () => {
    if (!user?.name) return 'CO';
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen w-full">
      {isMobile ? (
        <>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <CompanySidebar />
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <CompanySidebar />
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
            onClick={() => navigate("/company/profile")}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
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
