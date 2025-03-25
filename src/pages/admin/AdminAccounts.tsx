
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAccounts() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminAccounts, setAdminAccounts] = useState([
    { id: "1", name: "John Admin", email: "john@example.com", role: "Super Admin", lastLogin: "2 hours ago" },
    { id: "2", name: "Jane Admin", email: "jane@example.com", role: "Admin", lastLogin: "1 day ago" },
    { id: "3", name: "Mike Support", email: "mike@example.com", role: "Support Admin", lastLogin: "3 days ago" },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAccounts = adminAccounts.filter(account => 
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAccount = () => {
    // Logic to add new admin account
    console.log("Add new admin account");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Accounts</h1>
          <p className="text-muted-foreground">Manage system administrators and their permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search admin accounts..." 
              className="pl-8 w-[250px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>Manage all system administrators and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
                  <div>
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No admin accounts match your search" : "No admin accounts found"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <UserCog className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{account.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                        <span>•</span>
                        <p className="text-sm text-muted-foreground">Last login: {account.lastLogin}</p>
                        <Badge variant="outline">{account.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Revoke</Button>
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
