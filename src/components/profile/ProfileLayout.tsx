
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileLayoutProps {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  children?: React.ReactNode;
  tabs?: Array<{ id: string; label: string; content: React.ReactNode }>;
}

export function ProfileLayout({
  name,
  email,
  avatarUrl,
  role,
  children,
  tabs
}: ProfileLayoutProps) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="h-20 w-20 border-2 border-primary/10">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">{email}</p>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {role}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {tabs ? (
        <Tabs defaultValue={tabs[0].id} className="w-full">
          <TabsList className="w-full justify-start mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        children
      )}
    </div>
  );
}
