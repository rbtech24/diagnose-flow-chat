
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Company } from '@/types/company';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { XCircle } from "lucide-react";

export default function CompanyDetail() {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const { fetchCompanyById, updateCompany, deleteCompany } = useUserManagementStore();
  const { toast } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState<Partial<Company>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadCompany = async () => {
      if (companyId) {
        const fetchedCompany = await fetchCompanyById(companyId);
        setCompany(fetchedCompany);
        setUpdatedData(fetchedCompany || {});
      }
    };

    loadCompany();
  }, [companyId, fetchCompanyById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    // Ensure value is one of the allowed status types
    const statusValue = ['active', 'inactive', 'trial', 'expired'].includes(value) ? 
      value as 'active' | 'inactive' | 'trial' | 'expired' : 
      'active';
    
    setUpdatedData(prev => ({ ...prev, status: statusValue }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setUpdatedData(prev => ({ ...prev, trial_end_date: date }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    const statusValue = checked ? 'active' as const : 'inactive' as const;
    setUpdatedData(prev => ({ ...prev, status: statusValue }));
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
    setUpdatedData(company || {});
  };

  const saveChanges = async () => {
    if (!company) return;

    try {
      const result = await updateCompany(company.id, updatedData);
      
      if (result) {
        toast({
          title: "Success",
          description: "Company updated successfully",
        });
        setCompany({ ...company, ...updatedData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating company", error);
      toast({
        title: "Error",
        description: "Failed to update company",
        variant: "destructive"
      });
    }
  };

  const confirmDeleteCompany = () => {
    setIsDeleteDialogOpen(true);
  };

  const cancelDeleteCompany = () => {
    setIsDeleteDialogOpen(false);
  };

  const performDeleteCompany = async () => {
    if (!company) return;

    try {
      const result = await deleteCompany(company.id);
      
      if (result) {
        toast({
          title: "Success",
          description: "Company deleted successfully",
        });
        navigate("/admin/companies");
      }
    } catch (error) {
      console.error("Error deleting company", error);
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive"
      });
    }
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>View and manage company information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={updatedData.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select onValueChange={handleSelectChange} defaultValue={updatedData.status || 'active'}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input type="text" value={updatedData.status || 'active'} disabled />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                type="text"
                id="planName"
                name="planName"
                value={updatedData.planName || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="trial_end_date">Trial End Date</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !updatedData.trial_end_date && "text-muted-foreground"
                      )}
                    >
                      {updatedData.trial_end_date ? (
                        format(new Date(updatedData.trial_end_date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={updatedData.trial_end_date ? new Date(updatedData.trial_end_date) : undefined}
                      onSelect={handleDateChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  type="text"
                  id="trial_end_date"
                  value={updatedData.trial_end_date ? format(new Date(updatedData.trial_end_date), "PPP") : 'No Trial'}
                  disabled
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="active">Active</Label>
            <Checkbox
              id="active"
              checked={updatedData.status === 'active'}
              onCheckedChange={(checked) => handleCheckboxChange(checked === true)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={disableEditing}>Cancel</Button>
                <Button onClick={saveChanges}>Save</Button>
              </>
            ) : (
              <>
                <Button onClick={enableEditing}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Company</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the company
                        and remove all related data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={cancelDeleteCompany}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={performDeleteCompany}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
