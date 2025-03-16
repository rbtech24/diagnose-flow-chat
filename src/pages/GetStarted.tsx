
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GetStarted() {
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
        <h1 className="text-3xl font-bold mb-6">Getting Started with Repair Auto Pilot</h1>
        
        <div className="prose max-w-none">
          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Setting Up Your Account Is Easy</h2>
            <p className="mb-4">
              Follow these simple steps to get your repair business running on auto pilot:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li><Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link> for a free 14-day trial (no credit card required)</li>
              <li>Set up your company profile</li>
              <li>Invite your technicians</li>
              <li>Start creating diagnostic workflows</li>
            </ol>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Start Guide</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">1. Dashboard Overview</h3>
              <p>
                After logging in, your dashboard gives you a complete overview of your repair operations, 
                including active diagnostics, technician performance, and more.
              </p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">2. Create Workflows</h3>
              <p>
                Use our workflow editor to create step-by-step diagnostic guides for your technicians. 
                Drag and drop nodes to build intuitive troubleshooting paths.
              </p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">3. Assign to Technicians</h3>
              <p>
                Invite your technicians to join your company account, then assign them to the appropriate 
                diagnostic workflows based on their expertise.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Video Tutorials</h2>
          
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center mb-8">
            <div className="text-center">
              <div className="text-6xl text-gray-400 mb-4">▶️</div>
              <p className="text-gray-500">Video tutorials coming soon</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">How long does it take to set up?</h3>
              <p>
                Most companies are up and running within 30 minutes. Creating comprehensive diagnostic 
                workflows can take longer, but our templates can help you get started quickly.
              </p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Do I need to install any software?</h3>
              <p>
                No, Repair Auto Pilot is a cloud-based platform that works in any modern web browser. 
                Technicians can also use our mobile app (available for iOS and Android).
              </p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">What if I need help?</h3>
              <p>
                Our support team is available via chat, email, or phone during business hours. 
                You can also access our knowledge base and community forums 24/7.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-600 text-white rounded-lg p-8 mt-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="mb-6">Join the hundreds of repair companies already using Repair Auto Pilot</p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/signup">
                Start Your Free Trial
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
