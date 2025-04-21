
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

export default function Community() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Users className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">Community</h1>
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
          <h2 className="text-3xl font-bold mb-4">Connect with Other Pros</h2>
          <p className="mb-6 text-gray-700">
            The Repair Auto Pilot Community is where appliance repair professionals share knowledge, workflow tips, and industry insights.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Ask questions and get real answers from peers and support staff</li>
            <li>Show off successful fixes and workflow tricks</li>
            <li>Stay up to date on new features and best practices</li>
            <li>Suggest improvements to the platform</li>
          </ul>
          <p className="mt-8 text-gray-500 text-sm text-center">Community posts and discussions coming soon.</p>
        </section>
      </main>
    </div>
  );
}
