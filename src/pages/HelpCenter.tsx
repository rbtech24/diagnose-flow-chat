
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LifeBuoy } from "lucide-react";
import { NewTicketForm } from "@/components/support/NewTicketForm";
import { toast } from "sonner";
import { createSupportTicket } from "@/services/supportService";
import { TicketPriority } from "@/types/support";

export default function HelpCenter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmitTicket = async (title: string, description: string, priority: TicketPriority) => {
    setIsSubmitting(true);
    setError(undefined);
    
    try {
      await createSupportTicket(title, description, priority);
      
      // Show success message
      toast.success("Support ticket submitted successfully!", {
        description: "Our team will respond to your inquiry as soon as possible."
      });
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setError("Failed to submit ticket. Please try again later.");
      
      toast.error("Failed to submit support ticket", {
        description: "Please try again or contact us directly."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-lg flex items-center justify-center">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Help Center</h1>
              <p className="text-gray-600">Submit a support ticket and we'll get back to you shortly</p>
            </div>
          </div>
          
          <div className="mt-6 mb-12">
            <NewTicketForm 
              onSubmit={handleSubmitTicket}
              isSubmitting={isSubmitting}
              error={error}
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <p className="mb-4">
              Our support team is available Monday through Friday, 9am to 5pm EST.
              We typically respond to all inquiries within 24 hours.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">support@repairautopilot.com</p>
              </div>
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-gray-600">(800) 555-1234</p>
              </div>
            </div>
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
