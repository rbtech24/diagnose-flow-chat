
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Phone className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Contact</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-4 text-gray-700">Reach out to us for any questions—business or technical!</p>
          <div className="mb-4">
            <p className="font-semibold">Support:</p>
            <a className="text-blue-600 underline" href="mailto:support@repairautopilot.com">support@repairautopilot.com</a>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Sales:</p>
            <a className="text-blue-600 underline" href="mailto:sales@repairautopilot.com">sales@repairautopilot.com</a>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Phone:</p>
            <span className="text-gray-700">(800) 555-1234</span>
          </div>
          <p className="mt-8 text-gray-500">Visit our <Link to="/help" className="text-blue-600 underline">Help Center</Link> for FAQs.</p>
        </section>
      </main>
    </div>
  );
}
