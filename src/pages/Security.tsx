
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

export default function Security() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Shield className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Security</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Your Data, Always Secure</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>End-to-end encrypted communication</li>
            <li>Routine vulnerability assessments & penetration testing</li>
            <li>Role-based access and audit logs for all actions</li>
            <li>Encrypted backups and secure cloud storage</li>
          </ul>
          <p className="text-gray-700">
            We are committed to protecting your business and customer information. For security disclosures and bug bounty inquiries, please contact <a href="mailto:security@repairautopilot.com" className="text-blue-600 underline">security@repairautopilot.com</a>.
          </p>
        </section>
      </main>
    </div>
  );
}
