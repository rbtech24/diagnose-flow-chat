
import { useState } from "react";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wrench, Building2, History, Award, BarChart } from "lucide-react";

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
    yearsExperience: 7
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

  const statsCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-500" />
          Performance
        </CardTitle>
        <CardDescription>
          Your repair statistics and performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{techData.completedRepairs}</div>
            <p className="text-sm text-muted-foreground">Completed Repairs</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{techData.rating}</div>
            <p className="text-sm text-muted-foreground">Customer Rating</p>
          </div>
        </div>
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
      id: "stats",
      label: "Statistics",
      content: (
        <div className="space-y-6">
          {statsCard}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-500" />
                Repair History
              </CardTitle>
              <CardDescription>
                Overview of your recent repair work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">
                Detailed repair history will be available here.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "security",
      label: "Security",
      content: <PasswordForm />
    },
  ];

  return (
    <ProfileLayout
      name={techData.name}
      email={techData.email}
      role={techData.role}
      tabs={tabs}
    />
  );
}
