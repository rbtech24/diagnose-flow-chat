
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function Careers() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Briefcase className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Careers</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-gray-700 mb-6">We're always looking for talented, passionate individuals to help us build the future of appliance diagnostics. If you thrive in startup environments and care about making a real impact, let's talk.</p>
          <ul className="list-disc text-left pl-8 mb-4 text-gray-700">
            <li>Product and Engineering (React, Node, AI workflow)</li>
            <li>Customer Success and Support</li>
            <li>Sales and Marketing</li>
            <li>Content and Education</li>
          </ul>
          <p className="mb-4 text-gray-700">Email your resume to <a href="mailto:careers@repairautopilot.com" className="text-blue-600 underline">careers@repairautopilot.com</a></p>
        </section>
      </main>
    </div>
  );
}
