
import { CompanySidebar } from "./CompanySidebar";
import { Outlet } from "react-router-dom";

export function CompanyLayout() {
  return (
    <div className="flex h-screen w-full">
      <CompanySidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
