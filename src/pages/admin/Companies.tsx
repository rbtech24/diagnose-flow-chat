
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
import { useActivityLogger } from "@/hooks/useActivityLogger";

export default function AdminCompanies() {
  const navigate = useNavigate();
  const { companies, users, isLoadingCompanies, fetchCompanies, fetchUsers } = useUserManagementStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { logEvent } = useActivityLogger();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCompanies(), fetchUsers()]);
      logEvent('system', 'Companies page viewed', { count: companies.length });
    };
    
    loadData();
  }, [fetchCompanies, fetchUsers, logEvent, companies.length]);

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.subscription_tier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.trial_status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompany = (e: React.MouseEvent) => {
    // Prevent default to stop form submission or link navigation behavior
    e.preventDefault();
    // Log the activity
    logEvent('company', 'Add company initiated');
    // Navigate to the new company page
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

  // Calculate technician count for each company
  const getTechnicianCount = (companyId: string) => {
    return users.filter(user => user.companyId === companyId && user.role === 'tech').length;
  };

  const handleViewCompany = (companyId: string) => {
    logEvent('company', `Viewed company details`, { companyId });
    navigate(`/admin/companies/${companyId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Button className="flex items-center gap-2" onClick={handleAddCompany}>
          <Plus className="h-4 w-4" /> Add Company
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Companies</CardTitle>
          <CardDescription>Find companies by name, contact, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoadingCompanies ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium">No companies found</h2>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredCompanies.map(company => {
            const techCount = getTechnicianCount(company.id);
            
            return (
              <div key={company.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-lg border">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10">
                      {getCompanyInitials(company.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">{company.name}</h2>
                      <Badge className={`${getStatusBadgeStyle(company.trial_status || 'inactive')}`}>
                        {company.trial_status || 'inactive'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {techCount} technicians
                      </div>
                      {company.subscription_tier && (
                        <div className="flex items-center gap-1">
                          Plan: {company.subscription_tier}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={() => handleViewCompany(company.id)}>
                  View Details
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
