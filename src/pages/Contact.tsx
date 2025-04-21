
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-4 text-gray-700">Reach out to us for any questions—business or technical!</p>
          <div className="mb-4">
            <p className="font-semibold">Support:</p>
            <a href="mailto:support@repairautopilot.com" className="text-blue-600 underline">support@repairautopilot.com</a>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Sales:</p>
            <a href="mailto:sales@repairautopilot.com" className="text-blue-600 underline">sales@repairautopilot.com</a>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Phone:</p>
            <span className="text-gray-700">(800) 555-1234</span>
          </div>
          <p className="mt-8 text-gray-500">
            Visit our <a href="/help" className="text-blue-600 underline">Help Center</a> for FAQs and support resources.
          </p>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
