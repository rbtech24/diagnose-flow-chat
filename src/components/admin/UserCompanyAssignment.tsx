
import { useState, useEffect } from "react";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle2, XCircle } from "lucide-react";

interface UserCompanyAssignmentProps {
  userId: string;
  currentCompanyId?: string | null;
  onCompanyChange: (companyId: string | null) => Promise<void>;
  userRole: string;
  disabled?: boolean;
}

export default function UserCompanyAssignment({
  userId,
  currentCompanyId,
  onCompanyChange,
  userRole,
  disabled = false
}: UserCompanyAssignmentProps) {
  const { companies, fetchCompanies } = useUserManagementStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(currentCompanyId || null);
  
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Update selected company if current company changes
  useEffect(() => {
    setSelectedCompanyId(currentCompanyId || null);
  }, [currentCompanyId]);

  const handleAssignCompany = async () => {
    if (!selectedCompanyId || selectedCompanyId === currentCompanyId) return;
    
    setIsLoading(true);
    try {
      await onCompanyChange(selectedCompanyId);
      toast.success("User assigned to company successfully");
    } catch (error) {
      console.error('Error assigning user to company:', error);
      toast.error("Failed to assign user to company");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUnassignCompany = async () => {
    if (!currentCompanyId) return;
    
    setIsLoading(true);
    try {
      await onCompanyChange(null);
      setSelectedCompanyId(null);
      toast.success("User unassigned from company successfully");
    } catch (error) {
      console.error('Error unassigning user from company:', error);
      toast.error("Failed to unassign user from company");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Admin users cannot be assigned to companies
  if (userRole === 'admin') {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Company Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">Admin users are not assigned to specific companies</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Company Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Assigned Company
            </label>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <Select
                value={selectedCompanyId || ""}
                onValueChange={setSelectedCompanyId}
                disabled={isLoading || disabled}
              >
                <SelectTrigger className="w-full md:w-[260px]">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAssignCompany}
                  disabled={!selectedCompanyId || selectedCompanyId === currentCompanyId || isLoading || disabled}
                  size="sm"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Assign
                </Button>
                
                {currentCompanyId && (
                  <Button
                    variant="outline"
                    onClick={handleUnassignCompany}
                    disabled={isLoading || disabled}
                    size="sm"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Unassign
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {currentCompanyId && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-md text-sm">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Currently assigned to: {companies.find(c => c.id === currentCompanyId)?.name || "Unknown company"}</span>
            </div>
          )}
          
          {!currentCompanyId && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Not currently assigned to any company</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
