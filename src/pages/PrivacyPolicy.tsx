
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
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="lead mb-8">This Privacy Policy describes how Repair Auto Pilot ("we", "our", or "us") collects, uses, and shares your personal information when you use our service.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Create an account or user profile</li>
            <li>Use our diagnostic tools and workflows</li>
            <li>Submit information about appliance repairs</li>
            <li>Contact customer support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          
          <p>This information may include:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Name, email address, phone number, and company information</li>
            <li>Login credentials</li>
            <li>Diagnostic and repair data</li>
            <li>Device information and usage statistics</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Provide and maintain our service</li>
            <li>Improve and personalize user experience</li>
            <li>Develop new features and services</li>
            <li>Process transactions and send related information</li>
            <li>Send administrative messages and updates</li>
            <li>Respond to customer service requests</li>
            <li>Monitor service usage patterns</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Service providers who perform services on our behalf</li>
            <li>Professional advisors such as lawyers and accountants</li>
            <li>Third parties when required by law or to protect rights</li>
            <li>Business partners with your consent</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Access to and correction of your personal information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction or objection to processing</li>
            <li>Data portability</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Children's Privacy</h2>
          <p>Our service is not directed to children under 16. We do not knowingly collect personal information from children under 16. If we learn we have collected personal information from a child under 16, we will delete this information.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@repairautopilot.com.</p>
          
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
