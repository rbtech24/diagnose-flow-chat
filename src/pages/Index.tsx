
import React from "react";
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";
import { Button } from "@/components/ui/button";
import { Check, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      <HomeHeader />

      {/* HERO SECTION */}
      <section className="relative flex-1 pt-20 pb-28 px-4 sm:px-0">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <img
            src="/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png"
            alt="Repair Auto Pilot logo"
            className="h-24 mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The Ultimate Diagnostic Platform for Repair Professionals
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mb-10">
            AI-powered tools to increase your first time fix rates, streamline your workflows, and drive more business.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 mb-8">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white text-lg px-8">Start Free Trial</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-blue-700 border-blue-700 text-lg px-8">
                Contact Us
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Check className="text-green-500 w-5 h-5" /> No credit card required
            <Check className="text-green-500 w-5 h-5 ml-4" /> Cancel anytime
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Features to Supercharge Your Business</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-7 text-center shadow hover-scale">
              <h3 className="font-semibold text-xl mb-2">Fast Diagnostics</h3>
              <p className="text-gray-600 mb-2">Intuitive troubleshooting workflows cut hours off your jobs.</p>
              <Check className="mx-auto text-green-600 w-10 h-10" />
            </div>
            <div className="bg-blue-50 rounded-lg p-7 text-center shadow hover-scale">
              <h3 className="font-semibold text-xl mb-2">Team Management</h3>
              <p className="text-gray-600 mb-2">Assign work, view stats, and track technician performance.</p>
              <Check className="mx-auto text-green-600 w-10 h-10" />
            </div>
            <div className="bg-blue-50 rounded-lg p-7 text-center shadow hover-scale">
              <h3 className="font-semibold text-xl mb-2">24/7 Knowledge Access</h3>
              <p className="text-gray-600 mb-2">Mobile friendly and available even in the field, online or offline.</p>
              <Check className="mx-auto text-green-600 w-10 h-10" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-blue-800">
            What Our Customers Are Saying
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="mb-4 text-gray-700">
                "Repair Auto Pilot has transformed our operations. Our techs fix more on the first visit and our customers love us for it."
              </p>
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" alt="Customer" className="h-12 w-12 rounded-full border" />
                <span>
                  <span className="block font-bold">Jordan R.</span>
                  <span className="text-xs text-gray-500">Company Owner</span>
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="mb-4 text-gray-700">
                "The platform's easy to use, and their support is top-notch. I can focus on repairs instead of paperwork!"
              </p>
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/7e681dc0-4482-451f-9178-70944b120422.png" alt="Customer" className="h-12 w-12 rounded-full border" />
                <span>
                  <span className="block font-bold">Marisa B.</span>
                  <span className="text-xs text-gray-500">Field Technician</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-16 bg-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-3">Ready to Transform Your Repair Business?</h2>
          <p className="text-lg mb-8">Sign up in minutes or reach out to our team today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-blue-800 font-bold">Start Free Trial</Button>
            </Link>
            <a href="mailto:info@repairautopilot.com">
              <Button size="lg" variant="outline" className="border-white text-white">
                <Mail className="inline-block w-5 h-5 mr-2" />
                info@repairautopilot.com
              </Button>
            </a>
            <a href="tel:1234567890">
              <Button size="lg" variant="outline" className="border-white text-white">
                <Phone className="inline-block w-5 h-5 mr-2" />
                (123) 456-7890
              </Button>
            </a>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
