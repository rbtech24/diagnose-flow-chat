
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, RefreshCw } from "lucide-react";
import { SystemMessage } from "@/components/system/SystemMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UpdateData {
  id: string;
  title: string;
  content: string;
  version?: string;
  date: string;
}

export default function Updates() {
  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUpdates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('product_updates')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setUpdates(data || []);
    } catch (err) {
      console.error("Error fetching updates:", err);
      setError("Failed to load product updates. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load product updates",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUpdates();
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Product Updates</h1>
          
          {!isLoading && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchUpdates} 
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
        
        <p className="text-gray-600 mb-8 max-w-3xl">
          Stay up to date with the latest features, improvements, and fixes to Repair Auto Pilot.
        </p>

        <SystemMessage 
          id="subscribe-updates"
          type="info" 
          title="Subscribe to Updates" 
          message="Want to receive product updates via email? Sign up for our newsletter to stay informed." 
          dismissible={true}
          onDismiss={() => {}}
        />
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchUpdates}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : updates.length > 0 ? (
          <div className="space-y-6">
            {updates.map(update => (
              <div key={update.id} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-medium text-gray-900">{update.title}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500">
                      {new Date(update.date).toLocaleDateString()}
                    </span>
                    {update.version && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1">
                        v{update.version}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-gray-600">
                  <p>{update.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
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
