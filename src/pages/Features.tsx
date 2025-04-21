
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
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Powerful Features to Supercharge Your Repair Business</h2>
          <ul className="space-y-6">
            <li>
              <span className="font-semibold text-lg">🛠️ Guided Diagnostics Workflows:</span> 
              <span className="ml-2 text-gray-700">Step-by-step appliance diagnostics tailored for every technician level.</span>
            </li>
            <li>
              <span className="font-semibold text-lg">📅 Job & Schedule Management:</span> 
              <span className="ml-2 text-gray-700">Assign, schedule, and track repair jobs from a unified dashboard.</span>
            </li>
            <li>
              <span className="font-semibold text-lg">📱 Mobile-First Experience:</span>
              <span className="ml-2 text-gray-700">Seamlessly use on the go with responsive design for all devices.</span>
            </li>
            <li>
              <span className="font-semibold text-lg">🔒 Secure Customer Data:</span>
              <span className="ml-2 text-gray-700">Enterprise-level security protects all sensitive information.</span>
            </li>
            <li>
              <span className="font-semibold text-lg">📈 Analytics Dashboard:</span>
              <span className="ml-2 text-gray-700">Monitor team performance, completion rates, and workflow efficiency.</span>
            </li>
            <li>
              <span className="font-semibold text-lg">⚡ API Integrations:</span>
              <span className="ml-2 text-gray-700">Connect with your favorite tools, CRMs, or parts ordering systems.</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
