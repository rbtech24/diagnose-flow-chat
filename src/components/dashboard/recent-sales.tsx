
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  const recentSales = [
    {
      name: "Olivia Davis",
      email: "olivia@example.com",
      amount: "$429.00",
      date: "2 days ago",
      avatar: "/lovable-uploads/894f58ab-c3aa-45ba-9ea3-e3a2d9ddf247.png",
      initials: "OD"
    },
    {
      name: "Jackson Smith",
      email: "jackson@example.com",
      amount: "$829.00",
      date: "1 day ago",
      avatar: "/lovable-uploads/5e12430c-6872-485e-b07a-02b835f8e3d4.png", 
      initials: "JS"
    },
    {
      name: "Isabella Johnson",
      email: "isabella@example.com",
      amount: "$399.00",
      date: "3 hours ago",
      avatar: "/lovable-uploads/894f58ab-c3aa-45ba-9ea3-e3a2d9ddf247.png",
      initials: "IJ"
    },
    {
      name: "William Brown",
      email: "william@example.com",
      amount: "$699.00",
      date: "Just now",
      avatar: "/lovable-uploads/5e12430c-6872-485e-b07a-02b835f8e3d4.png",
      initials: "WB"
    }
  ];

  return (
    <div className="space-y-8">
      {recentSales.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.avatar} alt={sale.name} />
            <AvatarFallback>{sale.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">
            <p>{sale.amount}</p>
            <p className="text-xs text-muted-foreground">{sale.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
