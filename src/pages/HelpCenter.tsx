import { useState } from "react";
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";
import { NewTicketForm } from "@/components/support/NewTicketForm";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LifeBuoy } from "lucide-react";

export default function HelpCenter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmitTicket = (title: string, description: string, priority: any) => {
    setIsSubmitting(true);
    setError(undefined);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: "Support ticket submitted successfully! Our team will respond to your inquiry as soon as possible.",
        type: "success"
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-lg flex items-center justify-center">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Help Center</h1>
              <p className="text-gray-600">Submit a support ticket and we'll get back to you shortly.</p>
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
              Our support team is available Monday through Friday, 9am to 5pm EST. We typically respond to all inquiries within 24 hours.
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
      <HomeFooter />
    </div>
  );
}
