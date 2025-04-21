
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Company() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Repair Auto Pilot LLC</h2>
          <p className="mb-4 text-gray-700">
            Repair Auto Pilot is a leading provider of appliance repair workflow and diagnostic solutions. Our platform is trusted by hundreds of field service companies nationwide, empowering technicians and business owners to work more efficiently and deliver superior results.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">Our Values</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Trust & Transparency</li>
            <li>User-Focused Innovation</li>
            <li>Continuous Improvement</li>
            <li>Community and Collaboration</li>
          </ul>
          <p className="text-gray-700">
            For media and investor relations, please email <a href="mailto:info@repairautopilot.com" className="text-blue-600 underline">info@repairautopilot.com</a>.
          </p>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
