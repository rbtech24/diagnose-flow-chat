import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Resources() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Resources</h2>
          <p className="mb-4 text-gray-700">
            Explore helpful guides, documentation, and troubleshooting tips for maximizing your experience with Repair Auto Pilot.
          </p>
          {/* Add resource links/content here as you grow your knowledge base */}
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
