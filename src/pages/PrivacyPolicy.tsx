import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
          <p className="mb-4 text-gray-700">
            Your privacy is important to us. This Privacy Policy explains how Repair Auto Pilot collects, uses, and protects your personal information.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Contact Information (name, email, phone)</li>
            <li>Account Credentials (username, password)</li>
            <li>Billing Information (credit card details)</li>
            <li>Usage Data (IP address, browser type, pages visited)</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Provide and improve our services</li>
            <li>Process payments</li>
            <li>Communicate with you</li>
            <li>Personalize your experience</li>
            <li>Detect and prevent fraud</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">Data Security</h3>
          <p className="mb-4 text-gray-700">
            We implement industry-standard security measures to protect your personal information from unauthorized access, use, or disclosure.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">Data Sharing</h3>
          <p className="mb-4 text-gray-700">
            We do not share your personal information with third parties except as necessary to provide our services or as required by law.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">Your Rights</h3>
          <p className="mb-4 text-gray-700">
            You have the right to access, correct, or delete your personal information. Contact us at <a href="mailto:privacy@repairautopilot.com" className="text-blue-600 underline">privacy@repairautopilot.com</a> to exercise these rights.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h3>
          <p className="mb-4 text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any material changes.
          </p>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
