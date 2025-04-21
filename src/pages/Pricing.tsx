import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing, No Surprises</h2>
          <p className="mb-8 text-gray-700">Choose the plan that fits your shop. Billed monthly, cancel anytime.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="border rounded-lg p-6 bg-gray-50 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <p className="text-3xl font-bold mb-2">$29<span className="text-lg font-medium text-gray-500">/mo</span></p>
              <ul className="mb-4 flex-1 list-disc list-inside text-gray-700">
                <li>Up to 2 technicians</li>
                <li>Standard workflows</li>
                <li>Email support</li>
              </ul>
              <Button disabled>Current Plan</Button>
            </div>
            <div className="border-2 border-primary rounded-lg p-6 bg-white shadow-lg flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Growth</h3>
              <p className="text-3xl font-bold mb-2">$59<span className="text-lg font-medium text-gray-500">/mo</span></p>
              <ul className="mb-4 flex-1 list-disc list-inside text-gray-700">
                <li>Up to 8 technicians</li>
                <li>Advanced analytics</li>
                <li>Priority email support</li>
              </ul>
              <Button>Start Free Trial</Button>
            </div>
            <div className="border rounded-lg p-6 bg-gray-50 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-3xl font-bold mb-2">Contact Us</p>
              <ul className="mb-4 flex-1 list-disc list-inside text-gray-700">
                <li>Unlimited technicians</li>
                <li>Custom workflows</li>
                <li>Dedicated support</li>
              </ul>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
