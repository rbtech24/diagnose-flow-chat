
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, Building2, Workflow } from "lucide-react";

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Workflow className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-bold">Repair Management System</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-purple-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Repair Management <span className="text-purple-600">System</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Streamline your repair operations with our comprehensive management platform. Create diagnostic workflows, manage technicians, and improve service quality.
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Choose Your Dashboard</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="transition-transform hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-purple-600" />
                    System Admin
                  </CardTitle>
                  <CardDescription>
                    Complete platform management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-gray-600">
                    Manage all aspects of the platform, including users, companies, workflows, and system settings.
                  </p>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link to="/admin">
                      Access Admin Dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="transition-transform hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Company Admin
                  </CardTitle>
                  <CardDescription>
                    Manage your team and operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-gray-600">
                    Schedule jobs, manage technicians, customize workflows, and view detailed analytics.
                  </p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link to="/company">
                      Access Company Dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="transition-transform hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Technician Portal
                  </CardTitle>
                  <CardDescription>
                    Field service operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-gray-600">
                    Access job details, follow diagnostic workflows, submit reports, and manage your schedule.
                  </p>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link to="/tech">
                      Access Tech Dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">Access Repair Workflows</h2>
            <p className="mx-auto mb-8 max-w-2xl text-gray-600">
              View, create, and manage diagnostic workflows for your repair operations.
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/workflows">
                <Workflow className="mr-2 h-4 w-4" />
                Manage Workflows
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2023 Repair Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
