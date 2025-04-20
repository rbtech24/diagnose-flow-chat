
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CaseStudies() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a942106a-6512-4888-a5c2-dcf6c5d18b64.png" 
              alt="Repair Auto Pilot" 
              className="h-16"
            />
          </div>
          <Button asChild variant="outline">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Customer Success Stories</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          See how real appliance repair businesses have transformed their operations with our AI-powered diagnostic platform.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="overflow-hidden">
            <img 
              src="/lovable-uploads/894f58ab-c3aa-45ba-9ea3-e3a2d9ddf247.png"
              alt="Service Pro Appliance"
              className="h-48 w-full object-cover"
            />
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Service Pro Appliance: 92% First-Time Fix Rate</h2>
                <p className="text-gray-600">
                  Service Pro Appliance boosted their first-time fix rate from 65% to 92% using our AI-guided diagnostic workflows, reducing callbacks by 78%.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/case-study/service-pro">
                    Read Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <img 
              src="/lovable-uploads/c9eb6e16-d7c1-438f-86bb-eefa6fa5ad0e.png"
              alt="Elite Appliance Repair"
              className="h-48 w-full object-cover"
            />
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Elite Appliance Repair: Training Time Cut by 60%</h2>
                <p className="text-gray-600">
                  Elite Appliance Repair reduced new technician training time from 12 weeks to just 5 weeks while maintaining high service quality standards.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/case-study/elite-repair">
                    Read Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <img 
              src="/lovable-uploads/eecdb784-4fd9-47a5-9588-f4299e2dbd04.png"
              alt="Quick Fix Appliance Services"
              className="h-48 w-full object-cover"
            />
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Quick Fix Appliance: 40% Revenue Growth</h2>
                <p className="text-gray-600">
                  Quick Fix Appliance Services achieved 40% annual revenue growth by optimizing operations and expanding their service area with our platform.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/case-study/quick-fix">
                    Read Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-3/5 space-y-4">
              <h2 className="text-2xl font-bold">Featured Success: Metro Appliance Masters</h2>
              <p>
                Metro Appliance Masters transformed their business with Repair Auto Pilot's diagnostic platform and achieved:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>95% first-time fix rate on major appliance repairs</li>
                <li>Average service time reduced by 35 minutes per call</li>
                <li>Customer satisfaction score increased to 4.9/5</li>
                <li>New technician onboarding time reduced by 65%</li>
              </ul>
              <Button className="bg-blue-600" asChild>
                <Link to="/case-study/metro-masters">
                  Read the Full Story
                </Link>
              </Button>
            </div>
            <div className="md:w-2/5">
              <img 
                src="/lovable-uploads/83ff694d-eb6c-4d23-9e13-2f1b96f3258e.png"
                alt="Metro Appliance Masters Team"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Repair Service?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Join the hundreds of appliance repair companies already using Repair Auto Pilot to streamline their operations.
          </p>
          <Button asChild size="lg" className="bg-blue-600">
            <Link to="/signup">
              Start Your Free Trial
            </Link>
          </Button>
        </div>
      </main>
      
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/terms-of-use" onClick={() => window.scrollTo(0, 0)} className="text-sm text-gray-500 hover:text-blue-600">Terms of Use</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
