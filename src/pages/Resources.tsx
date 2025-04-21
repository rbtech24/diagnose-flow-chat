
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

export default function Resources() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Package className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Resources</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Industry Resources</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><a href="https://www.napsa.org/" target="_blank" rel="noopener" className="underline text-blue-600">National Appliance Service Professionals Association</a></li>
            <li><a href="https://www.servicenation.com/" target="_blank" rel="noopener" className="underline text-blue-600">Service Nation Alliance</a></li>
            <li><a href="https://www.ahamd.org/" target="_blank" rel="noopener" className="underline text-blue-600">Association of Home Appliance Manufacturers</a></li>
            <li><a href="https://www.energystar.gov/" target="_blank" rel="noopener" className="underline text-blue-600">Energy Star Rebates</a></li>
          </ul>
          <p className="text-gray-700">
            Looking for guides, workflow templates, or training? Email our team at <a href="mailto:resources@repairautopilot.com" className="text-blue-600 underline">resources@repairautopilot.com</a>
          </p>
        </section>
      </main>
    </div>
  );
}
