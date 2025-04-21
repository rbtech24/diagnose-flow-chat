
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Legal() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Legal Information</h2>
          <p className="mb-4 text-gray-700">
            Please review our <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a> and <a href="/terms" className="text-blue-600 underline">Terms of Use</a> for details about how we collect, use, and protect your information. For legal inquiries or requests, contact <a href="mailto:legal@repairautopilot.com" className="text-blue-600 underline">legal@repairautopilot.com</a>.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Copyright © {new Date().getFullYear()} Repair Auto Pilot</li>
            <li>All rights reserved</li>
            <li>Legal entity: Repair Auto Pilot LLC</li>
          </ul>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
