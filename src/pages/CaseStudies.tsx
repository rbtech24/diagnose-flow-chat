
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
          See how leading appliance repair companies have transformed their operations with Repair Auto Pilot's diagnostic workflows.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-6xl text-gray-400">🏢</div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">West Metro Appliance: 40% Increase in First-Time Fix Rate</h2>
                <p className="text-gray-600">
                  Learn how West Metro Appliance used our diagnostic workflows to dramatically improve their first-time fix rate and customer satisfaction.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="#">
                    Read Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-6xl text-gray-400">🏢</div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Einstein Repair: Reducing Training Time by 50%</h2>
                <p className="text-gray-600">
                  Discover how Einstein Appliance Repair cut training time for new technicians in half and improved service quality.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="#">
                    Read Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-6xl text-gray-400">🏢</div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Flat Rate Appliance: Scaling Operations with AI</h2>
                <p className="text-gray-600">
                  See how Flat Rate Appliance Repair expanded from 5 to 25 technicians while maintaining service quality.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="#">
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
              <h2 className="text-2xl font-bold">Featured Case Study: Rod's Appliance Repair</h2>
              <p>
                When Rod's Appliance Repair implemented Repair Auto Pilot, they saw immediate improvements in their service operations.
                By using our guided diagnostic workflows, they were able to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Increase first-time fix rate from 67% to 92%</li>
                <li>Reduce average time on site by 25 minutes</li>
                <li>Improve customer satisfaction scores by 35%</li>
                <li>Cut technician training time by 3 weeks</li>
              </ul>
              <Button className="bg-blue-600" asChild>
                <Link to="#">
                  Read the Full Story
                </Link>
              </Button>
            </div>
            <div className="md:w-2/5 flex items-center justify-center">
              <div className="h-64 w-64 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="text-8xl text-gray-400">🛠️</div>
              </div>
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
