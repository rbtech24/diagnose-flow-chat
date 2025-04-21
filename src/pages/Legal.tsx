
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

export default function Legal() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <FileText className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Legal</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Legal Information</h2>
          <p className="mb-4 text-gray-700">
            Please review our <Link to="/privacy" className="text-blue-600 underline">Privacy Policy</Link> and <Link to="/terms" className="text-blue-600 underline">Terms of Use</Link> for details about how we collect, use, and protect your information. For legal requests, please contact <a href="mailto:legal@repairautopilot.com" className="text-blue-600 underline">legal@repairautopilot.com</a>.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Copyright © {new Date().getFullYear()} Repair Auto Pilot</li>
            <li>All rights reserved</li>
            <li>Legal entity: Repair Auto Pilot LLC</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
