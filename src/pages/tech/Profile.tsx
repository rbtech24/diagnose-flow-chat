
import { useState } from "react";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Wrench, 
  Building2, 
  History, 
  Award, 
  BarChart, 
  Phone, 
  BookOpen,
  Upload,
  Trash2,
  Moon,
  Bell
} from "lucide-react";
import { PerformanceMetrics } from "@/components/tech/PerformanceMetrics";
import { ServiceHistory } from "@/components/tech/ServiceHistory";
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { AccountDeletion } from "@/components/profile/AccountDeletion";
import { ThemePreferences } from "@/components/profile/ThemePreferences";
import { NotificationSettings } from "@/components/profile/NotificationSettings";

export default function TechProfile() {
  // Mock technician data - would typically come from API/context
  const [techData, setTechData] = useState({
    name: "Alex Technician",
    email: "alex@acmerepair.com",
    phone: "555-123-7890",
    title: "Senior Repair Technician",
    role: "Technician",
    companyName: "Acme Repair Services",
    companyId: "acme123",
    skills: ["Refrigeration", "HVAC", "Dishwashers", "Laundry Machines"],
    completedRepairs: 248,
    rating: 4.8,
    assignedToCompany: true,
    yearsExperience: 7,
    avatarUrl: "" // Will be populated by the image upload component
  });

  const handleProfileUpdate = (values: any) => {
    setTechData({
      ...techData,
      ...values
    });
  };

  const skillsCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-500" />
          Technical Skills
        </CardTitle>
        <CardDescription>
          Your specialized repair skills and capabilities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {techData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
              {skill}
            </Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-2">
          Update Skills
        </Button>
      </CardContent>
    </Card>
  );

  const contactCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-500" />
          Contact Information
        </CardTitle>
        <CardDescription>
          Your contact details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-500" />
            <p>{techData.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <p>{techData.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const companyCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          Company Affiliation
        </CardTitle>
        <CardDescription>
          Your current company information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {techData.assignedToCompany ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-blue-100">
                <AvatarFallback className="bg-blue-50 text-blue-700">
                  {techData.companyName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{techData.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  Member for {techData.yearsExperience} years
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-2">You are not currently affiliated with any company.</p>
            <Button variant="outline" size="sm">
              Find Companies
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const recentServiceCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          Recent Services
        </CardTitle>
        <CardDescription>
          Your recent repair activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ServiceHistory />
      </CardContent>
    </Card>
  );

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <ProfileForm defaultValues={techData} onSubmit={handleProfileUpdate} title="Technician Profile" description="Update your technician profile information." />
    },
    {
      id: "avatar",
      label: "Profile Image",
      content: <ProfileImageUpload 
        currentImageUrl={techData.avatarUrl} 
        onImageUpdate={(url) => handleProfileUpdate({avatarUrl: url})} 
      />
    },
    {
      id: "skills",
      label: "Skills & Company",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsCard}
          {companyCard}
        </div>
      )
    },
    {
      id: "performance",
      label: "Performance",
      content: <PerformanceMetrics 
        completedRepairs={techData.completedRepairs}
        customerRating={techData.rating}
        averageTime="1h 42m"
        efficiencyScore={92}
        customersServed={185}
      />
    },
    {
      id: "history",
      label: "Service History",
      content: (
        <div className="space-y-6">
          {recentServiceCard}
        </div>
      )
    },
    {
      id: "contact",
      label: "Contact",
      content: contactCard
    },
    {
      id: "theme",
      label: "Theme",
      content: <ThemePreferences />
    },
    {
      id: "notifications",
      label: "Notifications",
      content: <NotificationSettings />
    },
    {
      id: "security",
      label: "Security",
      content: <PasswordForm />
    },
    {
      id: "account",
      label: "Account",
      content: <AccountDeletion />
    },
  ];

  return (
    <ProfileLayout
      name={techData.name}
      email={techData.email}
      role={techData.role}
      avatarUrl={techData.avatarUrl}
      tabs={tabs}
    />
  );
}
