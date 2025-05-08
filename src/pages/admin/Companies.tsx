
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AdminCompanies() {
  const navigate = useNavigate();
  const { companies, isLoadingCompanies, fetchCompanies } = useUserManagementStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompany = () => {
    navigate("/admin/companies/new");
  };

  // Helper function to get company initials for avatar fallback
  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper function to get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">Manage all registered companies</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies..." 
              className="pl-8 w-[250px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCompany}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Companies</CardTitle>
          <CardDescription>Companies currently using the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCompanies ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32 mt-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No companies match your search" : "No companies found"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={company.logoUrl} alt={company.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getCompanyInitials(company.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{company.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{company.technicianCount} technicians</span>
                        <span>•</span>
                        <span>{company.planName || "Basic"} plan</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusBadgeStyle(company.status)}>
                      {company.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/companies/${company.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
