
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a942106a-6512-4888-a5c2-dcf6c5d18b64.png" 
              alt="Repair Auto Pilot" 
              className="h-10"
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
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>

        <div className="prose max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the Repair Auto Pilot service ("Service"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Service.</p>
          <h2>2. Description of Service</h2>
          <p>Repair Auto Pilot provides appliance diagnostic workflows and tools for repair professionals.</p>
          <h2>3. User Accounts</h2>
          <p>You are responsible for your account security and all activities under your account.</p>
          <h2>4. Acceptable Use</h2>
          <p>You agree to use the Service lawfully and not engage in harmful activity.</p>
          <h2>5. Intellectual Property</h2>
          <p>The Service content is owned by Repair Auto Pilot and protected by law.</p>
          <h2>6. Termination</h2>
          <p>We may terminate access at any time for violations.</p>
          <h2>7. Limitation of Liability</h2>
          <p>Repair Auto Pilot is not liable for indirect or consequential damages.</p>
          <h2>8. Changes to Terms</h2>
          <p>We may update terms at any time; please check periodically.</p>
          <h2>9. Governing Law</h2>
          <p>These terms are governed by United States law.</p>
          <h2>10. Contact Us</h2>
          <p>Contact support@repairautopilot.com for questions.</p>
          <p className="mt-6 text-gray-600">Last updated: August 2023</p>
        </div>
      </main>
    </div>
  );
}
