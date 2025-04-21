
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/5e12430c-6872-485e-b07a-02b835f8e3d4.png" 
              alt="Repair Auto Pilot" 
              className="h-20"
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
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose max-w-none">
          <p>This Privacy Policy describes how Repair Auto Pilot ("we", "our", or "us") collects, uses, and shares your personal information when you use our services.</p>
          <h2>Information We Collect</h2>
          <p>We collect personal information when you:</p>
          <ul className="list-disc pl-6 my-2">
            <li>Create a user account or profile</li>
            <li>Use our diagnostic tools and workflows</li>
            <li>Submit information about repairs</li>
            <li>Contact customer support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <h2>How We Use Your Information</h2>
          <p>We use the information to provide, maintain, and improve our services, communicate updates, respond to support requests, and comply with legal obligations.</p>
          <h2>Sharing Your Information</h2>
          <p>Your data may be shared only with trusted service providers and legal entities per our privacy practices.</p>
          <h2>Data Security</h2>
          <p>We implement security measures to protect your information but no internet transmission is 100% secure.</p>
          <h2>Your Rights</h2>
          <p>You may have rights to access, correct, or delete your personal data depending on your jurisdiction.</p>
          <h2>Contact Us</h2>
          <p>For questions about this Privacy Policy, please contact us at <a href="mailto:privacy@repairautopilot.com" className="text-blue-600 underline">privacy@repairautopilot.com</a>.</p>
          <p className="mt-6 text-gray-600">Last updated: August 2023</p>
        </div>
      </main>
    </div>
  );
}
