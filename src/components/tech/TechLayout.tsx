
import { TechSidebar } from "./TechSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserMessages } from "@/context/SystemMessageContext";
import { SystemMessage } from "@/components/system/SystemMessage";

export function TechLayout() {
  const navigate = useNavigate();
  const userMessages = useUserMessages("tech");

  return (
    <div className="flex h-screen w-full">
      <TechSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" />
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full"
            onClick={() => navigate("/tech/profile")}
          >
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <img className="aspect-square h-full w-full" src="https://i.pravatar.cc/300" alt="Profile" />
            </span>
          </Button>
        </div>
        <div className="p-6">
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
