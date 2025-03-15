
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
              src="/lovable-uploads/0fb2afe9-44dd-487d-b13a-f6a2c630c477.png" 
              alt="Repair Auto Pilot" 
              className="h-10"
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
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using the Repair Auto Pilot service ("Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>Repair Auto Pilot provides appliance diagnostic workflows and tools for repair service businesses. The Service includes web applications, mobile applications, and related services.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>Some features of the Service require a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Acceptable Use</h2>
          <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Use the Service in any way that violates any applicable laws or regulations.</li>
            <li>Impersonate or attempt to impersonate another user or person.</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
            <li>Attempt to gain unauthorized access to any portion of the Service.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are owned by Repair Auto Pilot and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
          <p>We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
          <p>In no event shall Repair Auto Pilot be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@repairautopilot.com.</p>
          
          <p className="mt-8 text-gray-600">Last updated: August 2023</p>
        </div>
      </main>
      
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
