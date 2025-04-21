import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function TermsOfUse() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
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
      <HomeFooter />
    </div>
  );
}
