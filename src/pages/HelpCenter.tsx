
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Book, Video, LifeBuoy, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HelpCenter() {
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
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        
        <div className="bg-blue-50 rounded-lg p-8 my-8">
          <h2 className="text-xl font-semibold mb-4 text-center">How can we help you today?</h2>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input className="pl-10" placeholder="Search for help articles, tutorials, and more..." />
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                <Book className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm mb-4">
                Comprehensive guides and references for all Repair Auto Pilot features.
              </p>
              <Button variant="outline" size="sm" className="w-full">Browse Docs</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="bg-green-100 text-green-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Video Tutorials</h3>
              <p className="text-gray-600 text-sm mb-4">
                Step-by-step video guides showing how to use our platform effectively.
              </p>
              <Button variant="outline" size="sm" className="w-full">Watch Tutorials</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="bg-amber-100 text-amber-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact our support team for personalized assistance with your issues.
              </p>
              <Button variant="outline" size="sm" className="w-full">Contact Support</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="bg-purple-100 text-purple-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">FAQ</h3>
              <p className="text-gray-600 text-sm mb-4">
                Quick answers to the most common questions about our platform.
              </p>
              <Button variant="outline" size="sm" className="w-full">View FAQs</Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="getting-started" className="my-12">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="account">Account & Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Setting up your company profile</h3>
                <p className="text-sm text-gray-600">Learn how to set up your company profile and add your team members.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Inviting technicians</h3>
                <p className="text-sm text-gray-600">Step-by-step guide to inviting technicians to your account.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">First-time setup checklist</h3>
                <p className="text-sm text-gray-600">Complete this checklist to ensure your account is properly set up.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Mobile app installation</h3>
                <p className="text-sm text-gray-600">How to install the Repair Auto Pilot app on technicians' mobile devices.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="diagnostics">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Creating diagnostic workflows</h3>
                <p className="text-sm text-gray-600">Learn how to create and edit diagnostic workflows for different appliances.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Using the workflow editor</h3>
                <p className="text-sm text-gray-600">A comprehensive guide to the workflow editor interface.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Running diagnostics in the field</h3>
                <p className="text-sm text-gray-600">How technicians can use diagnostic workflows during service calls.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Analyzing diagnostic results</h3>
                <p className="text-sm text-gray-600">Understanding diagnostic reports and using insights to improve operations.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Managing your subscription</h3>
                <p className="text-sm text-gray-600">How to view, upgrade, or change your subscription plan.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Billing and invoices</h3>
                <p className="text-sm text-gray-600">Where to find and download your billing history and invoices.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Adding or removing user licenses</h3>
                <p className="text-sm text-gray-600">How to adjust the number of user licenses in your account.</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium">Updating payment information</h3>
                <p className="text-sm text-gray-600">Steps to update your payment method or billing details.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-gray-50 rounded-lg p-8 my-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Our support team is available Monday through Friday, 9am to 5pm EST.
            We typically respond to all inquiries within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/contact">
                Contact Support
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/community-forum">
                Visit Community Forum
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
