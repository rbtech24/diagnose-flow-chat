
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
import { useLayout } from "@/components/layout/LayoutProvider";
import { useBaseComponent } from "@/hooks/useBaseComponent";
import { withErrorBoundary } from "@/components/error/withErrorBoundary";

function TechLayoutComponent() {
  const navigate = useNavigate();
  const userMessages = useUserMessages("tech");
  const isMobile = useIsMobile();
  const { currentUser, fetchUsers } = useUserManagementStore();
  const { state: layoutState, setSidebarOpen, setSidebarCollapsed } = useLayout();
  
  const { logAction, logError } = useBaseComponent({
    componentName: 'TechLayout',
    onMount: () => {
      if (!currentUser) {
        fetchUsers().catch(error => {
          logError('Failed to fetch users on mount', error);
        });
      }
    }
  });

  // Fetch users on component mount if we don't have a current user
  useEffect(() => {
    if (!currentUser) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  const handleSearchFocus = () => {
    logAction('search_focused');
  };

  const handleProfileNavigation = () => {
    logAction('profile_navigation');
    navigate("/tech/profile");
  };

  const handleMenuToggle = () => {
    logAction('mobile_menu_toggle');
    setSidebarOpen(!layoutState.sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full">
      {isMobile ? (
        <>
          <Sheet open={layoutState.sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <TechSidebar collapsed={false} />
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <TechSidebar collapsed={layoutState.sidebarCollapsed} />
      )}
      
      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 border-b flex items-center justify-between">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={handleMenuToggle}
              data-testid="mobile-menu-toggle"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          <div className="relative w-full max-w-[180px] sm:max-w-[250px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-8 py-1 h-9 text-sm" 
              onFocus={handleSearchFocus}
              data-testid="search-input"
            />
          </div>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full"
            onClick={handleProfileNavigation}
            data-testid="profile-button"
          >
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <img 
                className="aspect-square h-full w-full" 
                src={currentUser?.avatarUrl || "https://i.pravatar.cc/300"} 
                alt="Profile" 
              />
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

export const TechLayout = withErrorBoundary(TechLayoutComponent, {
  level: 'page',
  onError: (error, errorInfo) => {
    console.error('TechLayout Error:', error, errorInfo);
  }
});
