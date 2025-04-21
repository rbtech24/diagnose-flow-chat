import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserPlus } from "lucide-react";
import { useUserManagementStore } from "@/store/userManagementStore";
import { toast } from "@/hooks/use-toast";
import { UserWithPassword } from "@/types/user";

export function TechnicianOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "tech"
  });
  
  const { addUser } = useUserManagementStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const tempPassword = "ChangeMe" + Math.floor(Math.random() * 10000);
      
      await addUser({
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: 'pending',
        role: 'tech',
        password: tempPassword
      } as UserWithPassword);
      
      toast({
        title: "Success",
        description: "Technician invited successfully",
      });
      
      setFormData({ name: "", email: "", phone: "", role: "tech" });
      setStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to invite technician",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Technician
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <Button 
                type="button" 
                onClick={() => setStep(2)} 
                disabled={!formData.name || !formData.email}
              >
                Next
              </Button>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{formData.name}</p>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                      {formData.phone && <p className="text-sm text-muted-foreground">{formData.phone}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending Invite..." : "Send Invite"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
