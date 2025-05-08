
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function Partners() {
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
        <h1 className="text-3xl font-bold mb-6">Partner Program</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Join our partner ecosystem and grow your business while helping appliance repair companies transform their operations with Repair Auto Pilot.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Reseller Partners</h2>
              <p className="mb-4">
                Expand your service offerings by reselling Repair Auto Pilot to your clients. Our reseller program provides competitive margins, 
                sales enablement resources, and dedicated support.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Competitive commission structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Co-branded marketing materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Sales and technical training</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Dedicated partner manager</span>
                </li>
              </ul>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Become a Reseller
              </Button>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Technology Partners</h2>
              <p className="mb-4">
                Integrate your solution with Repair Auto Pilot to create powerful combined offerings for appliance repair companies. 
                Our API-first approach makes integration straightforward.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive API documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Development sandbox environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Technical integration support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Joint marketing opportunities</span>
                </li>
              </ul>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Become a Technology Partner
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 my-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Partner With Us?</h2>
            <p className="mb-6">
              Contact our partnerships team to discuss how we can work together.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                Contact Partnership Team
              </Link>
            </Button>
          </div>
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
