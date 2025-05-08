
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user";
import { getUserInitials, getUserAvatarColor } from "@/utils/avatarUtils";

interface UserProfileHeaderProps {
  user: User | null;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user }) => {
  if (!user) return null;
  
  const initials = getUserInitials(user);
  const avatarColor = getUserAvatarColor(user);

  const roleBadgeColor = 
    user.role === "admin" 
      ? "bg-red-100 text-red-800" 
      : user.role === "company" 
        ? "bg-blue-100 text-blue-800" 
        : "bg-green-100 text-green-800";

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-lg shadow mb-6">
      <Avatar className="h-24 w-24 border-2 border-primary/10">
        <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
        <AvatarFallback className="text-xl font-medium" style={{ backgroundColor: avatarColor, color: "white" }}>
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-bold">{user.name || "User"}</h1>
        <p className="text-gray-500">{user.email}</p>
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadgeColor}`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
          {user.status && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          )}
          {user.companyId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Company Member
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
