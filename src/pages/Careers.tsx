import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Careers() {
  const openPositions = [
    {
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "Remote (US/Europe)",
      type: "Full-time",
      description: "Build and scale our AI-powered diagnostic platform using React, Node.js, and machine learning technologies."
    },
    {
      title: "Product Manager - Diagnostic Tools",
      department: "Product",
      location: "Remote (US)",
      type: "Full-time",
      description: "Lead the development of our core diagnostic workflow tools and shape the future of appliance repair technology."
    },
    {
      title: "Technical Support Specialist",
      department: "Customer Success",
      location: "Remote (US)",
      type: "Full-time",
      description: "Help appliance repair businesses implement and maximize value from our platform."
    }
  ];

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
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Join Our Mission</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Help us revolutionize the appliance repair industry by making advanced diagnostic tools accessible to technicians worldwide.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-8 my-8">
            <h2 className="text-2xl font-semibold mb-4">Why Work With Us?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Meaningful Impact</h3>
                <p>
                  Your work will directly impact thousands of repair technicians and the customers they serve every day.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Remote-First Culture</h3>
                <p>
                  We believe in hiring the best talent regardless of location, with flexible work arrangements.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
                <p>
                  As a growing company, we offer abundant opportunities for professional development and career advancement.
                </p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-12 mb-6">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Comprehensive Health Benefits</h3>
                <p className="text-gray-600">Medical, dental, and vision coverage for you and your dependents.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-piggy-bank">
                  <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/>
                  <path d="M2 9v1c0 1.1.9 2 2 2h1"/>
                  <path d="M16 11h0"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">401(k) with Company Match</h3>
                <p className="text-gray-600">Plan for your future with our retirement savings program.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palmtree">
                  <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/>
                  <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/>
                  <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35z"/>
                  <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Generous PTO</h3>
                <p className="text-gray-600">Flexible paid time off to rest, recharge, and pursue your passions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Professional Development</h3>
                <p className="text-gray-600">Annual stipend for courses, conferences, and learning resources.</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-12 mb-6">Open Positions</h2>
          <div className="space-y-4 mb-12">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:border-blue-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{position.title}</h3>
                      <p className="text-gray-600">{position.department} • {position.location} • {position.type}</p>
                      <p className="text-gray-600">{position.description}</p>
                    </div>
                    <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
                      Apply Now <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 my-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Don't See What You're Looking For?</h2>
            <p className="mb-6">
              We're always interested in connecting with talented individuals. Send us your resume and let us know how you can contribute.
            </p>
            <Button>
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/terms-of-use" className="text-sm text-gray-500 hover:text-blue-600">Terms of Use</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
