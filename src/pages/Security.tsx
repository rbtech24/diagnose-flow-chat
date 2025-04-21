
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Security() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Your Data, Always Secure</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>End-to-end encrypted communication</li>
            <li>Routine vulnerability assessments & penetration testing</li>
            <li>Role-based access and audit logs for all actions</li>
            <li>Encrypted backups and secure cloud storage</li>
          </ul>
          <p className="text-gray-700">
            We are committed to protecting your business and customer data. For security disclosures and bug bounty inquiries, contact{" "}
            <a href="mailto:security@repairautopilot.com" className="text-blue-600 underline">security@repairautopilot.com</a>.
          </p>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
