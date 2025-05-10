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
    setUpdatedData(prev => ({ ...prev, status: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setUpdatedData(prev => ({ ...prev, trialEndDate: date }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setUpdatedData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }));
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
      await updateCompany(company.id, updatedData);
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
      setCompany({ ...company, ...updatedData });
      setIsEditing(false);
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
      await deleteCompany(company.id);
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
      navigate("/admin/companies");
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
                    <SelectItem value="suspended">Suspended</SelectItem>
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
              <Label htmlFor="trialEndDate">Trial End Date</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !updatedData.trialEndDate && "text-muted-foreground"
                      )}
                    >
                      {updatedData.trialEndDate ? (
                        format(new Date(updatedData.trialEndDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={updatedData.trialEndDate ? new Date(updatedData.trialEndDate) : undefined}
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
                  id="trialEndDate"
                  value={updatedData.trialEndDate ? format(new Date(updatedData.trialEndDate), "PPP") : 'No Trial'}
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
              onCheckedChange={(checked) => {
                if (checked !== undefined) {
                  handleCheckboxChange(checked);
                }
              }}
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
