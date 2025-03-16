
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { useEffect } from "react";
import { SystemMessage } from "@/components/system/SystemMessage";
import { useUserRole } from "@/hooks/useUserRole";

export default function Updates() {
  const { userRole } = useUserRole();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <h1 className="text-3xl font-bold mb-4">Product Updates</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Stay up to date with the latest features, improvements, and fixes to Repair Auto Pilot.
        </p>

        <SystemMessage 
          type="info" 
          title="Subscribe to Updates" 
          message="Want to receive product updates via email? Sign up for our newsletter to stay informed." 
          visible={true} 
        />
        
        <div className="bg-white rounded-lg border my-6 p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-blue-50 p-3 mb-4">
              <Info className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Current Updates</h3>
            <p className="text-gray-500 max-w-md">
              There are no new product updates at this time. Check back later for the latest improvements and features.
            </p>
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
