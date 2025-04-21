
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function Company() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Briefcase className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Our Company</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Repair Auto Pilot LLC</h2>
          <p className="mb-4 text-gray-700">
            Repair Auto Pilot is a leading provider of appliance repair workflow and diagnostic solutions. Our platform is trusted by hundreds of field service companies nationwide, empowering technicians and business owners to work more efficiently and deliver superior results.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">Our Values</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Trust & Transparency</li>
            <li>User-Focused Innovation</li>
            <li>Continuous Improvement</li>
            <li>Community and Collaboration</li>
          </ul>
          <p className="text-gray-700">
            For media and investor relations, please email <a href="mailto:info@repairautopilot.com" className="text-blue-600 underline">info@repairautopilot.com</a>.
          </p>
        </section>
      </main>
    </div>
  );
}
