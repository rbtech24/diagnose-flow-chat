
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { License } from "@/types/subscription-consolidated";
import { LicenseCard } from "@/components/subscription/LicenseCard";
import { NewLicenseForm } from "@/components/subscription/NewLicenseForm";
import { Search, Plus, Package } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { LicenseService } from "@/services/licenseService";

export default function AdminLicenses() {
  const { 
    licenses, 
    fetchPlans, 
    isLoadingLicenses,
    error 
  } = useSubscriptionStore();
  
  const [allLicenses, setAllLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Load all licenses for admin view
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchPlans();
        const allLicensesData = await LicenseService.getAllLicenses();
        setAllLicenses(allLicensesData);
      } catch (error) {
        console.error('Error loading licenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchPlans]);
  
  const filteredLicenses = allLicenses.filter((license) => {
    const matchesSearch =
      searchQuery === "" ||
      (license.company_name && license.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      license.plan_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      license.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddLicense = async (newLicense: License) => {
    try {
      const createdLicense = await LicenseService.createLicense({
        company_id: newLicense.company_id,
        company_name: newLicense.company_name,
        plan_id: newLicense.plan_id,
        plan_name: newLicense.plan_name,
        active_technicians: newLicense.activeTechnicians,
        max_technicians: newLicense.maxTechnicians
      });
      
      setAllLicenses(prev => [createdLicense, ...prev]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding license:', error);
    }
  };

  const handleDeactivateLicense = async (licenseId: string) => {
    try {
      await LicenseService.updateLicense(licenseId, { status: 'canceled' });
      setAllLicenses(prev => 
        prev.map(license => 
          license.id === licenseId 
            ? { ...license, status: 'canceled' as const, updatedAt: new Date() }
            : license
        )
      );
    } catch (error) {
      console.error('Error deactivating license:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading licenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Licenses</h1>
          <p className="text-gray-500">View and manage all active licenses across companies</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add License
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies or plans..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Licenses</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-6" />

      {filteredLicenses.length === 0 ? (
        <div className="text-center py-16">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No Licenses Found</h2>
          <p className="mt-2 text-gray-500">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by adding a new license."}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Add First License
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLicenses.map((license) => (
            <LicenseCard
              key={license.id}
              license={license}
              onDeactivate={() => handleDeactivateLicense(license.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New License</DialogTitle>
          </DialogHeader>
          <NewLicenseForm
            onSubmit={handleAddLicense}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
