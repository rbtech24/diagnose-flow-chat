
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe } from "lucide-react";
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Get in Touch</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions about Repair Auto Pilot? We're here to help. Choose your preferred way to reach us.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">We'll respond within 24 hours</p>
                <a href="mailto:support@repairautopilot.com" className="text-blue-600 hover:text-blue-700">
                  support@repairautopilot.com
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-green-600 h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Mon-Fri, 9am-5pm EST</p>
                <a href="tel:1-800-repair-ap" className="text-blue-600 hover:text-blue-700">
                  1-800-REPAIR-AP
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-4">Our headquarters</p>
                <address className="text-blue-600 not-italic">
                  123 Tech Lane<br />
                  San Francisco, CA 94105
                </address>
              </div>
            </div>

            <div className="mt-16 max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-center">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
