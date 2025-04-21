
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Partners() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
          <p className="mb-4 text-gray-700">
            We work with industry-leading companies, supplier networks, and technology innovators such as:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>National appliance parts distributors</li>
            <li>Logistics and fulfillment providers</li>
            <li>Field service management software</li>
            <li>Professional associations (NAPSA, etc.)</li>
          </ul>
          <p className="mb-2 text-gray-500">
            Interested in partnering? Email us at <a href="mailto:partnerships@repairautopilot.com" className="text-blue-600 underline">partnerships@repairautopilot.com</a>
          </p>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
