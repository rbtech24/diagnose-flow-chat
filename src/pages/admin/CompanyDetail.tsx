
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Users, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/companies")} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Company Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Acme Repairs {id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Premium Plan</p>
                <p className="text-sm text-muted-foreground">Active since Jan 2023</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Contact</span>
                <span className="font-medium">John Smith</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">contact@acmerepairs.com</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="font-medium">(555) 123-4567</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="font-medium">Los Angeles, CA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Technicians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">5</div>
            <p className="text-sm text-muted-foreground">All technicians active</p>
            <Button className="w-full mt-4" variant="outline">
              <Link to={`/admin/companies/${id}/technicians`} className="text-black w-full">View Technicians</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mb-2">Premium Plan</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              Renews on May 1, 2023
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Link to={`/admin/companies/${id}/subscription`} className="text-black w-full">Manage Subscription</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-md">
              <div className="font-medium">Technician Added</div>
              <div className="text-sm text-muted-foreground">April 15, 2023</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="font-medium">Subscription Upgraded</div>
              <div className="text-sm text-muted-foreground">April 10, 2023</div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="font-medium">Support Ticket Created</div>
              <div className="text-sm text-muted-foreground">April 8, 2023</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
