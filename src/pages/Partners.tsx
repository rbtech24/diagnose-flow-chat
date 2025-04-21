
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

export default function Partners() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Users className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Partners</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
          <p className="mb-4 text-gray-700">We work with industry-leading companies, supplier networks, and technology innovators:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>National appliance parts distributors</li>
            <li>Logistics and fulfillment providers</li>
            <li>Field service management software</li>
            <li>Professional associations (NAPSA, etc.)</li>
          </ul>
          <p className="mb-2 text-gray-500">Interested in partnering? Email <a className="text-blue-600 underline" href="mailto:partnerships@repairautopilot.com">partnerships@repairautopilot.com</a></p>
        </section>
      </main>
    </div>
  );
}
