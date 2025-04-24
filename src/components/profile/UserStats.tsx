
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Clock, Calendar, Award } from "lucide-react";
import { User } from "@/types/user";

interface UserStatsProps {
  user: User | null;
}

export const UserStats: React.FC<UserStatsProps> = ({ user }) => {
  if (!user) return null;

  // Demo stats - in a real application, these would come from the backend
  const stats = [
    { 
      icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
      title: "Role",
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1)
    },
    { 
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      title: "Member Since",
      value: "April 2024" // This would come from user creation date
    },
    { 
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      title: "Status",
      value: user.status.charAt(0).toUpperCase() + user.status.slice(1)
    },
    { 
      icon: <Award className="h-5 w-5 text-purple-500" />,
      title: "Subscription",
      value: user.subscriptionStatus || "Free Tier"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {stat.icon}
              <CardTitle className="text-sm text-gray-600">{stat.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
