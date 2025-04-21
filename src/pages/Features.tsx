
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

export default function Features() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Star className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Features</h1>
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
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Powerful Features to Supercharge Your Repair Business</h2>
          <ul className="space-y-6 text-gray-700 list-disc pl-6">
            <li><strong>Guided Diagnostics Workflows:</strong> Step-by-step appliance diagnostics designed for every technician level to ensure accuracy and efficiency.</li>
            <li><strong>Job & Schedule Management:</strong> Easily assign, track, and schedule jobs with a unified dashboard for your team.</li>
            <li><strong>Mobile-First Experience:</strong> Responsive design allowing seamless use on smartphones and tablets in the field.</li>
            <li><strong>Secure Customer Data:</strong> Enterprise-grade security protocols protect all sensitive business and customer information.</li>
            <li><strong>Analytics Dashboard:</strong> Monitor your team's performance, job completion rates, and workflow efficiency with actionable insights.</li>
            <li><strong>API Integrations:</strong> Connect your preferred tools, CRM, parts ordering and more with flexible integration options.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
